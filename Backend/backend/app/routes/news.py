from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
import requests
from app.database import get_db
from app.models import Article, User
from app.schemas import ArticleResponse
from app.config import settings
from datetime import datetime
from typing import List, Optional
from app.security import verify_token

router = APIRouter()

def fetch_from_newsapi(query: str = "technology", limit: int = 15, offset: int = 0) -> List[dict]:
    url = "https://newsapi.org/v2/everything"
    params = {
        "q": query,
        "sortBy": "publishedAt",
        "language": "en",
        "pageSize": limit,
        "page": (offset // limit) + 1 if limit > 0 else 1,
        "apiKey": settings.NEWSAPI_KEY
    }
    
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        return data.get("articles", [])
    except requests.exceptions.RequestException:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to fetch from NewsAPI")

@router.get("/combined", response_model=List[ArticleResponse])
def get_combined_news_feed(
    db: Session = Depends(get_db), 
    current_user: User = Depends(verify_token),
    query: str = Query("technology", description="News category query"),
    limit: int = Query(15, ge=1, le=50),
    offset: int = Query(0, ge=0)
):
    external_data = fetch_from_newsapi(query=query, limit=limit, offset=offset)
    
    articles_to_return = []
    new_articles_to_add = []
    
    for article_data in external_data:
        article_url = article_data.get("url")
        if not article_url:
            continue
            
        existing = db.query(Article).filter(Article.url == article_url).first()
        
        if existing:
            articles_to_return.append(existing)
        else:
            try:
                # FIX: Check if publishedAt is available before converting
                published_at_str = article_data.get("publishedAt", "")
                published_at = datetime.fromisoformat(published_at_str.replace("Z", "+00:00")) if published_at_str else datetime.utcnow()

                new_article = Article(
                    title=article_data.get("title", ""),
                    description=article_data.get("description"),
                    content=article_data.get("content"),
                    source=article_data.get("source", {}).get("name") or "newsapi",
                    image_url=article_data.get("urlToImage"),
                    url=article_url,
                    published_at=published_at
                )
                new_articles_to_add.append(new_article)
                articles_to_return.append(new_article)
            except Exception:
                continue

    if new_articles_to_add:
        db.add_all(new_articles_to_add)
        db.commit()
    
    admin_articles = db.query(Article).filter(Article.source == "admin").all()
    
    all_articles = articles_to_return + admin_articles
    
    all_articles.sort(key=lambda x: x.published_at, reverse=True)
    
    start = offset
    end = offset + limit
    
    return all_articles[start:end]

@router.get("/", response_model=List[ArticleResponse])
def get_news(
    db: Session = Depends(get_db), 
    query: str = Query("technology", description="News query"),
    limit: int = Query(6, ge=1)
):
    return get_combined_news_feed(db=db, query=query, limit=limit, offset=0)


@router.get("/featured", response_model=ArticleResponse)
def get_featured_news(db: Session = Depends(get_db)):
    articles_data_list = fetch_from_newsapi("breaking", limit=1)
    
    if not articles_data_list:
        raise HTTPException(status_code=404, detail="No featured article available")
    
    articles_data = articles_data_list[0]
    article_url = articles_data.get("url")
    
    existing = db.query(Article).filter(Article.url == article_url).first()
    
    # FIX: Return existing article immediately if found
    if existing:
        return existing
    
    try:
        published_at_str = articles_data.get("publishedAt", "")
        published_at = datetime.fromisoformat(published_at_str.replace("Z", "+00:00")) if published_at_str else datetime.utcnow()
        
        featured_article = Article(
            title=articles_data.get("title", ""),
            description=articles_data.get("description"),
            content=articles_data.get("content"),
            source=articles_data.get("source", {}).get("name") or "newsapi",
            image_url=articles_data.get("urlToImage"),
            url=article_url,
            published_at=published_at
        )
        db.add(featured_article)
        db.commit()
        db.refresh(featured_article)
        return featured_article
        
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to process or save featured article")

@router.get("/search", response_model=List[ArticleResponse])
def search_news(
    db: Session = Depends(get_db), 
    q: str = Query("technology", description="Search keyword"), 
    limit: int = Query(10, ge=1)
):
    return get_combined_news_feed(db=db, query=q, limit=limit, offset=0)