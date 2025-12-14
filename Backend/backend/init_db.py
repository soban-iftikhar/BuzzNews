"""Initialize database with tables"""
from app.database import engine, Base
# Import all models to ensure SQLAlchemy knows about them before creating tables
from app.models import User, Article, Favorite, WatchLater 

# Create all tables safely
# checkfirst=True ensures SQLAlchemy only issues CREATE TABLE commands if the table doesn't already exist.
Base.metadata.create_all(bind=engine, checkfirst=True)
print("Database tables checked and initialized successfully!")