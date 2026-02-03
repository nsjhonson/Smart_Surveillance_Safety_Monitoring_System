from ultralytics import YOLO
import cv2
import numpy as np

class ObjectDetector:
    def __init__(self, model_path="yolov8n.pt"):
        self.model = YOLO(model_path)
        # Class IDs for COCO dataset
        self.TARGET_CLASSES = {
            0: "Restricted Zone Intrusion", # Person
            43: "Weapon Detected (Knife)",  # Knife
            76: "Weapon Detected (Scissors)" # Scissors
        }
        
    def detect(self, frame):
        """
        Run inference on a frame.
        Returns result object from YOLO.
        """
        results = self.model(frame, verbose=False)
        return results[0]

    def detect_violations(self, frame, results):
        """
        Analyze detections for specific violations.
        Returns a list of violation dictionaries.
        """
        violations = []
        
        for box in results.boxes:
            cls_id = int(box.cls[0])
            conf = float(box.conf[0])
            
            if cls_id in self.TARGET_CLASSES and conf > 0.5:
                violations.append({
                    "type": self.TARGET_CLASSES[cls_id],
                    "confidence": conf,
                    "bbox": box.xyxy[0].tolist() # x1, y1, x2, y2
                })
                
        return violations
