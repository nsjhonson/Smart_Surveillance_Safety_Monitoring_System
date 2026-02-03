import cv2
import threading
import time
from datetime import datetime
from app.cv.detector import ObjectDetector
from app.core.database import AsyncSessionLocal
from app.models.violation import Violation
from sqlalchemy.future import select
import asyncio

class VideoProcessor:
    def __init__(self, source=0, model_path="yolov8n.pt"):
        self.source = source
        self.detector = ObjectDetector(model_path)
        self.running = False
        self.thread = None
        self.lock = threading.Lock()
        self.last_frame = None # Buffer for streaming
        self.frame_lock = threading.Lock() # Lock for frame access

    def start(self):
        with self.lock:
            # If already running, just update source and return (or restart)
            if self.running:
                print("Restarting video processor...")
                self.stop()
                # return
            
            self.running = True
            self.thread = threading.Thread(target=self._process_loop)
            self.thread.daemon = True
            self.thread.start()

    def stop(self):
        with self.lock:
            self.running = False
            if self.thread:
                self.thread.join()
                self.thread = None

    def _process_loop(self):
        cap = cv2.VideoCapture(self.source)
        if not cap.isOpened():
            print(f"Error: Could not open video source {self.source}")
            self.running = False
            return

        print(f"Started video processing from source {self.source}")
        
        while self.running:
            ret, frame = cap.read()
            if not ret:
                print("End of stream or read error.")
                break

            # Detection
            results = self.detector.detect(frame)
            violations = self.detector.detect_violations(frame, results)

            # Annotation
            annotated_frame = results.plot()
            
            # Update latest frame for streaming
            with self.frame_lock:
                self.last_frame = annotated_frame.copy()
            
            # Display (Optional - might not work well in headless server env, but good for local)
            # cv2.imshow("Surveillance Feed", annotated_frame)
            # if cv2.waitKey(1) & 0xFF == ord('q'):
            #     self.stop()
            #     break
            
            # Handle Violations
            if violations:
                for v in violations:
                    print(f"ALERT: {v['type']} (Conf: {v['confidence']:.2f})")
                    # Save to DB asynchronously
                    # Since we are in a thread, we need a new event loop or run_coroutine_threadsafe
                    # For simplicity in this demo, we'll try to fire and forget or use a sync wrapper if possible.
                    # Ideally we use an async queue, but here is a simple task launch.
                    try:
                        loop = asyncio.get_event_loop()
                        if loop.is_running():
                             loop.create_task(self._save_violation(v))
                        else:
                             asyncio.run(self._save_violation(v))
                    except RuntimeError:
                        # New loop for thread
                         asyncio.run(self._save_violation(v))
                         
                    # --- Trigger Notifications (Fire and Forget) ---
                    # Only send for high confidence (> 0.70) to avoid spam
                    if v['confidence'] > 0.70:
                        try:
                           from app.core.notifications import send_alert_email
                           # We need to run this in the async loop as well
                           # Re-using the logic above
                           loop = asyncio.get_event_loop() 
                           loop.create_task(send_alert_email(
                               violation_type=v['type'],
                               camera_source=str(self.source),
                               confidence=v['confidence']
                           ))
                        except Exception as e:
                            print(f"Notification Trigger Error: {e}")

        cap.release()
        cv2.destroyAllWindows()
        print("Video processing stopped.")

    async def _save_violation(self, violation_data):
        async with AsyncSessionLocal() as session:
            new_violation = Violation(
                violation_type=violation_data['type'],
                confidence=violation_data['confidence'],
                camera_source=str(self.source),
                timestamp=datetime.utcnow()
            )
            session.add(new_violation)
            await session.commit()

    def generate_frames(self):
        """Yields MJPEG frames indefinitely."""
        while True:
            with self.frame_lock:
                if self.last_frame is None:
                    time.sleep(0.1)
                    continue
                
                # Encode frame to JPEG
                ret, buffer = cv2.imencode('.jpg', self.last_frame)
                frame = buffer.tobytes()
            
            # Yield frame in MJPEG format
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
            
            # Control frame rate for stream (approx 20 FPS)
            time.sleep(0.05)
