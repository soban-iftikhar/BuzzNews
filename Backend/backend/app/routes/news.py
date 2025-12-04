from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import requests
from app.database import get_db
from app.models import Article
from app.schemas import ArticleResponse
from app.config import settings
from datetime import datetime
from typing import List

router = APIRouter()

def fetch_from_newsapi(query: str = "technology") -> List[ArticleResponse]:
    """Fetch articles from NewsAPI"""
    url = "https://newsapi.org/v2/everything"
    params = {
        "q": query,
        "sortBy": "publishedAt",
        "language": "en",
        "apiKey": settings.NEWSAPI_KEY
    }
    
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        return data.get("articles", [])
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to fetch from NewsAPI")

@router.get("/", response_model=List[ArticleResponse])
def get_news(db: Session = Depends(get_db), query: str = "technology", limit: int = 6):
    """Get 6 news articles from NewsAPI"""
    articles_data = fetch_from_newsapi(query)[:limit]
    
    articles_response = []
    for article_data in articles_data:
        # Check if article already exists in DB
        existing = db.query(Article).filter(Article.url == article_data.get("url")).first()
        
        if existing:
            articles_response.append(existing)
        else:
            # Create new article
            new_article = Article(
                title=article_data.get("title", ""),
                description=article_data.get("description"),
                content=article_data.get("content"),
                source="newsapi",
                image_url=article_data.get("urlToImage"),
                url=article_data.get("url"),
                published_at=datetime.fromisoformat(article_data.get("publishedAt", "").replace("Z", "+00:00"))
            )
            db.add(new_article)
            articles_response.append(new_article)
    
    db.commit()
    return articles_response

@router.get("/search", response_model=List[ArticleResponse])
def search_news(db: Session = Depends(get_db), q: str = "technology", limit: int = 10):
    """Search news articles"""
    articles_data = fetch_from_newsapi(q)[:limit]
    
    articles_response = []
    for article_data in articles_data:
        existing = db.query(Article).filter(Article.url == article_data.get("url")).first()
        
        if existing:
            articles_response.append(existing)
        else:
            new_article = Article(
                title=article_data.get("title", ""),
                description=article_data.get("description"),
                content=article_data.get("content"),
                source="newsapi",
                image_url=article_data.get("urlToImage"),
                url=article_data.get("url"),
                published_at=datetime.fromisoformat(article_data.get("publishedAt", "").replace("Z", "+00:00"))
            )
            db.add(new_article)
            articles_response.append(new_article)
    
    db.commit()
    return articles_response
