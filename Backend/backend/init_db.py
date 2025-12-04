"""Initialize database with tables"""
from app.database import engine, Base
from app.models import User, Article, Favorite, WatchLater

# Create all tables
Base.metadata.create_all(bind=engine)
print("Database tables created successfully!")
