from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from app.core.config import settings
from pydantic import EmailStr

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=settings.MAIL_TLS,
    MAIL_SSL_TLS=settings.MAIL_SSL,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

async def send_alert_email(violation_type: str, camera_source: str, confidence: float):
    """
    Sends an email alert for a detected violation.
    """
    if "your-email" in settings.MAIL_USERNAME:
        print("[MOCK EMAIL] Email settings custom not configured. Skipping send.")
        print(f"[MOCK EMAIL] To: {settings.ALERT_RECIPIENT} | Alert: {violation_type}")
        return

    html = f"""
    <h1>Sentinel Prime Alert 🚨</h1>
    <p>A safety violation has been detected.</p>
    <ul>
        <li><strong>Type:</strong> {violation_type}</li>
        <li><strong>Confidence:</strong> {confidence:.2f}</li>
        <li><strong>Source:</strong> {camera_source}</li>
        <li><strong>Time:</strong> Now</li>
    </ul>
    """

    message = MessageSchema(
        subject=f"🚨 ALERT: {violation_type} Detected",
        recipients=[settings.ALERT_RECIPIENT],
        body=html,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    try:
        await fm.send_message(message)
        print("Alert email sent successfully.")
    except Exception as e:
        print(f"Failed to send email: {e}")
