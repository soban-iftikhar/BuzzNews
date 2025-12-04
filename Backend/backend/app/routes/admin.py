from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Article
from app.schemas import ArticleCreate, ArticleResponse
from app.security import verify_token
from datetime import datetime

router = APIRouter()

@router.post("/articles", response_model=ArticleResponse)
def create_article(article_data: ArticleCreate, current_user: User = Depends(verify_token), db: Session = Depends(get_db)):
    """Create and publish a news article (Admin only)"""
    # Check if user is admin
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admins can create articles")
    
    # Create article
    new_article = Article(
        title=article_data.title,
        description=article_data.description,
        content=article_data.content,
        author_id=current_user.id,
        source="admin",
        image_url=article_data.image_url,
        url=article_data.url,
        published_at=datetime.utcnow()
    )
    db.add(new_article)
    db.commit()
    db.refresh(new_article)
    
    return new_article

@router.get("/articles", response_model=list)
def get_admin_articles(current_user: User = Depends(verify_token), db: Session = Depends(get_db)):
    """Get all admin-created articles"""
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admins can view this")
    
    articles = db.query(Article).filter(Article.source == "admin").all()
    return articles
