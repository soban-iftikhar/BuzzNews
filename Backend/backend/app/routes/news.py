from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
import requests
from app.database import get_db
from app.models import Article, User
from app.schemas import ArticleResponse
from app.config import settings
from datetime import datetime
from typing import List, Optional
from app.security import verify_token # Assuming you want to keep the feed protected or use its token

router = APIRouter()

# --- Helper Function for External API Fetch ---
def fetch_from_newsapi(query: str = "technology", limit: int = 15, offset: int = 0) -> List[dict]:
    url = "https://newsapi.org/v2/everything"
    params = {
        "q": query,
        "sortBy": "publishedAt",
        "language": "en",
        "pageSize": limit, # Use pageSize for limit
        "page": (offset // limit) + 1 if limit > 0 else 1, # Calculate page from offset
        "apiKey": settings.NEWSAPI_KEY
    }
    
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        # Return the list of raw dictionaries
        return data.get("articles", [])
    except requests.exceptions.RequestException:
        # Raise HTTP exception directly
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to fetch from NewsAPI")


# --- New Route for Combined News Feed (For the /feed endpoint) ---
@router.get("/combined", response_model=List[ArticleResponse])
def get_combined_news_feed(
    db: Session = Depends(get_db), 
    current_user: User = Depends(verify_token), # Use token for authorized access
    query: str = Query("technology", description="News category query"),
    limit: int = Query(15, ge=1, le=50), # Max 50 articles
    offset: int = Query(0, ge=0)
):
    # 1. Fetch External Articles
    external_data = fetch_from_newsapi(query=query, limit=limit, offset=offset)
    
    articles_to_return = []
    new_articles_to_add = []
    
    # Process and save external articles
    for article_data in external_data:
        existing = db.query(Article).filter(Article.url == article_data.get("url")).first()
        
        if existing:
            articles_to_return.append(existing)
        else:
            try:
                new_article = Article(
                    title=article_data.get("title", ""),
                    description=article_data.get("description"),
                    content=article_data.get("content"),
                    source=article_data.get("source", {}).get("name") or "newsapi",
                    image_url=article_data.get("urlToImage"),
                    url=article_data.get("url"),
                    published_at=datetime.fromisoformat(article_data.get("publishedAt", "").replace("Z", "+00:00"))
                )
                new_articles_to_add.append(new_article)
                articles_to_return.append(new_article)
            except Exception:
                continue # Skip badly formatted articles

    # Save new external articles to DB
    db.add_all(new_articles_to_add)
    db.commit()
    
    # 2. Fetch Admin Articles from DB
    # Fetch all local admin articles and append them to the list
    admin_articles = db.query(Article).filter(Article.source == "admin").all()
    
    # 3. Merge and Sort
    all_articles = articles_to_return + admin_articles
    
    # Sort by published_at (most recent first)
    all_articles.sort(key=lambda x: x.published_at, reverse=True)
    
    # We apply limit and offset to the FINAL merged list for accurate display in feed
    start = offset
    end = offset + limit
    
    return all_articles[start:end]

# --- Existing Routes (Kept for consistency, modified to use new fetch helper) ---

# This route is now a simpler wrapper around the combined logic for the feed
@router.get("/", response_model=List[ArticleResponse])
def get_news(
    db: Session = Depends(get_db), 
    query: str = Query("technology", description="News query"),
    limit: int = Query(6, ge=1)
):
    """Get news articles (used by Home page, less complex fetch)"""
    # Simply call the combined feed logic with a low limit
    return get_combined_news_feed(db=db, query=query, limit=limit, offset=0)


@router.get("/featured", response_model=ArticleResponse)
def get_featured_news(db: Session = Depends(get_db)):
    """Get the most recent featured article"""
    # Fetch top article externally
    articles_data = fetch_from_newsapi("breaking", limit=1)[0]
    
    if not articles_data:
        raise HTTPException(status_code=404, detail="No featured article available")
    
    # Check if article already exists in DB (for consistent ID)
    existing = db.query(Article).filter(Article.url == articles_data.get("url")).first()
    
    if existing:
        return existing
    
    featured_article = Article(
        title=articles_data.get("title", ""),
        description=articles_data.get("description"),
        content=articles_data.get("content"),
        source=articles_data.get("source", {}).get("name") or "newsapi",
        image_url=articles_data.get("urlToImage"),
        url=articles_data.get("url"),
        published_at=datetime.fromisoformat(articles_data.get("publishedAt", "").replace("Z", "+00:00"))
    )
    db.add(featured_article)
    db.commit()
    db.refresh(featured_article)
    return featured_article


@router.get("/search", response_model=List[ArticleResponse])
def search_news(
    db: Session = Depends(get_db), 
    q: str = Query("technology", description="Search keyword"), 
    limit: int = Query(10, ge=1)
):
    """Search news articles"""
    # Use the combined logic for search, setting the query parameter
    return get_combined_news_feed(db=db, query=q, limit=limit, offset=0)