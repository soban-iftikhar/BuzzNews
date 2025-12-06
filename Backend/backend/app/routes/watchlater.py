from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload  # <-- IMPORTED joinedload
from app.database import get_db
from app.models import User, Article, WatchLater
from app.schemas import WatchLaterResponse, WatchLaterCreate
from app.security import verify_token
from typing import List

router = APIRouter()

@router.post("/", response_model=WatchLaterResponse)
def add_watch_later(watchlater_data: WatchLaterCreate, current_user: User = Depends(verify_token), db: Session = Depends(get_db)):
    """Add article to watch later"""
    # Check if article exists
    article = db.query(Article).filter(Article.id == watchlater_data.article_id).first()
    if not article:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article not found")
    
    # Check if already in watch later
    existing = db.query(WatchLater).filter(
        (WatchLater.user_id == current_user.id) & (WatchLater.article_id == watchlater_data.article_id)
    ).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Already added to watch later")
    
    # Create watch later
    watch_later = WatchLater(user_id=current_user.id, article_id=watchlater_data.article_id)
    db.add(watch_later)
    db.commit()
    db.refresh(watch_later)
    
    return watch_later

@router.get("/", response_model=List[WatchLaterResponse])
def get_watch_later(current_user: User = Depends(verify_token), db: Session = Depends(get_db)):
    """Get user's watch later articles"""
    # CRITICAL FIX: Use joinedload to eagerly fetch the related 'article' data
    watch_later = db.query(WatchLater).options(
        joinedload(WatchLater.article)
    ).filter(
        WatchLater.user_id == current_user.id
    ).all()
    
    return watch_later

@router.delete("/{watchlater_id}")
def remove_watch_later(watchlater_id: str, current_user: User = Depends(verify_token), db: Session = Depends(get_db)):
    """Remove article from watch later"""
    watch_later = db.query(WatchLater).filter(
        (WatchLater.id == watchlater_id) & (WatchLater.user_id == current_user.id)
    ).first()
    
    if not watch_later:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Watch later item not found")
    
    db.delete(watch_later)
    db.commit()
    
    return {"message": "Removed from watch later"}