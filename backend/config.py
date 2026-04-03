import os
from dotenv import load_dotenv

# .env dosyasını yükle
load_dotenv()

class Config:
    # Veritabanı bağlantı ayarları
    MYSQL_HOST     = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_USER     = os.getenv("MYSQL_USER", "root")
    MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "")
    MYSQL_DB       = os.getenv("MYSQL_DB", "booksite_db")

    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}"
        f"@{MYSQL_HOST}/{MYSQL_DB}?charset=utf8mb4"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT ayarları
    JWT_SECRET_KEY       = os.getenv("JWT_SECRET_KEY", "gizli-anahtar-123")
    JWT_ACCESS_TOKEN_EXPIRES_HOURS = 24  # 1 gün
