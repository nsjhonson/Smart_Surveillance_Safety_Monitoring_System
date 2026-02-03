# Smart Surveillance & Safety Monitoring System

A real-time computer vision system for detecting safety violations (Helmet, Mask, Intrusion) using YOLOv8, OpenCV, FastAPI, and PostgreSQL.

## Features
*   **Real-time Detection**: Uses YOLOv8 to detect objects (simulated Violations for prototype).
*   **Live Alerts**: API endpoint to fetch recent violations.
*   **Database Storage**: Stores violation events with timestamp and confidence in PostgreSQL.
*   **REST API**: Control detection (Start/Stop) and retrieve data.

## Prerequisites
1.  Python 3.9+
2.  PostgreSQL (Running locally or in Docker)
3.  Webcam (for live testing)

## Setup
1.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

2.  **Environment Configuration**:
    Create a `.env` file in the root directory (or use defaults in `app/core/config.py`):
    ```env
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=yourpassword
    POSTGRES_SERVER=localhost
    POSTGRES_PORT=5432
    POSTGRES_DB=surveillance_db
    ```
    *Note*: Ensure the database `surveillance_db` exists in your Postgres instance.

3.  **Run the Application**:
    ```bash
    uvicorn app.main:app --reload
    ```
    The application will automatically create the necessary database tables on first startup.

4.  **Run the Frontend**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    Access the dashboard at `http://localhost:5173`.

## Usage

### API Documentation
Open your browser and navigate to: `http://127.0.0.1:8000/docs` to see the interactive Swagger UI.

### Control Endpoints
*   **Start Detection**:
    *   POST `/control/start?source=0`
    *   `source`: `0` for default webcam, `1` for external, or absolute path to a video file.
*   **Stop Detection**:
    *   POST `/control/stop`

### View Alerts
*   **Get Violations**:
    *   GET `/alerts?limit=50`
    *   Returns a JSON list of recent violations.

## Computer Vision Logic (Note)
*   **Model**: Currently uses standard `yolov8n.pt`.
*   **Logic**: 
    *   Detects `person` class as "Restricted Zone Intrusion" for demonstration.
    *   For actual Helmet/Mask detection, custom trained weights are required. Once available, update `app/cv/detector.py` with the new model path and class IDs.

## Troubleshooting

### PowerShell "Scripts Disabled" Error
If you see an error like `cannot be loaded because running scripts is disabled`, run this in PowerShell (Admin):
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### "Safety is not recognized" Error
This happens because of the **`&`** symbol in the folder name (`Smart Surveillance & Safety...`).
*   **Fix 1**: Run `npm run dev` directly in PowerShell (don't use `cmd /c`).
*   **Fix 2**: Rename the project folder to remove the `&` (e.g., `Smart_Surveillance`).
