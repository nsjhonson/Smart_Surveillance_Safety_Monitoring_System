import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Smart Surveillance System"
    PROJECT_VERSION: str = "0.1.0"
    
    # Database
    # POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    # POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "password")
    # POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "localhost")
    # POSTGRES_PORT: str = os.getenv("POSTGRES_PORT", "5432")
    # POSTGRES_DB: str = os.getenv("POSTGRES_DB", "surveillance_db")
    
    @property
    def DATABASE_URL(self) -> str:
        # Fallback to SQLite for easier local setup if Postgres fails
        return "sqlite+aiosqlite:///./surveillance.db"

    # Mail Settings (Defaults for Gmail)
    MAIL_USERNAME: str = os.getenv("MAIL_USERNAME", "your-email@gmail.com")
    MAIL_PASSWORD: str = os.getenv("MAIL_PASSWORD", "your-app-password")
    MAIL_FROM: str = os.getenv("MAIL_FROM", "your-email@gmail.com")
    MAIL_PORT: int = int(os.getenv("MAIL_PORT", 587))
    MAIL_SERVER: str = os.getenv("MAIL_SERVER", "smtp.gmail.com")
    MAIL_FROM_NAME: str = "Sentinel Prime"
    MAIL_TLS: bool = True
    MAIL_SSL: bool = False
    
    # Recipient
    ALERT_RECIPIENT: str = os.getenv("ALERT_RECIPIENT", "admin@sentinel.com")

    class Config:
        env_file = ".env"

settings = Settings()
