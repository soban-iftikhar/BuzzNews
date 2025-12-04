from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base
import uuid

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    favorites = relationship("Favorite", back_populates="user", cascade="all, delete-orphan")
    watch_later = relationship("WatchLater", back_populates="user", cascade="all, delete-orphan")
    articles = relationship("Article", back_populates="author")

class Article(Base):
    __tablename__ = "articles"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    description = Column(Text)
    content = Column(Text)
    author_id = Column(String, ForeignKey("users.id"), nullable=True)  # Null for NewsAPI articles
    source = Column(String, default="newsapi")  # "newsapi" or "admin"
    image_url = Column(String)
    url = Column(String, unique=True)
    published_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    author = relationship("User", back_populates="articles")
    favorites = relationship("Favorite", back_populates="article", cascade="all, delete-orphan")
    watch_later = relationship("WatchLater", back_populates="article", cascade="all, delete-orphan")

class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    article_id = Column(String, ForeignKey("articles.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="favorites")
    article = relationship("Article", back_populates="favorites")

class WatchLater(Base):
    __tablename__ = "watch_later"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    article_id = Column(String, ForeignKey("articles.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="watch_later")
    article = relationship("Article", back_populates="watch_later")
