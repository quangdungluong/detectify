from app.core.config import settings
from app.models.base import BaseModel
from sqlalchemy import create_engine


def init_db():
    # Create database engine
    engine = create_engine(settings.DB_URI)

    # Create all tables
    BaseModel.metadata.create_all(bind=engine)


if __name__ == "__main__":
    print("Creating database tables...")
    init_db()
    print("Database tables created successfully!")
