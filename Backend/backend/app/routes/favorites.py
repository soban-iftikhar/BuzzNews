from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload  # <-- IMPORTED joinedload
from app.database import get_db
from app.models import User, Article, Favorite
from app.schemas import FavoriteResponse, FavoriteCreate
from app.security import verify_token
from typing import List

router = APIRouter()

@router.post("/", response_model=FavoriteResponse)
def add_favorite(favorite_data: FavoriteCreate, current_user: User = Depends(verify_token), db: Session = Depends(get_db)):
    """Add article to favorites"""
    # Check if article exists
    article = db.query(Article).filter(Article.id == favorite_data.article_id).first()
    if not article:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article not found")
    
    # Check if already favorited
    existing = db.query(Favorite).filter(
        (Favorite.user_id == current_user.id) & (Favorite.article_id == favorite_data.article_id)
    ).first()
    if existing:
        # Note: A common pattern is to DELETE on subsequent POST, but here we raise an error.
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Already added to favorites")
    
    # Create favorite
    favorite = Favorite(user_id=current_user.id, article_id=favorite_data.article_id)
    db.add(favorite)
    db.commit()
    db.refresh(favorite)
    
    return favorite

@router.get("/", response_model=List[FavoriteResponse])
def get_favorites(current_user: User = Depends(verify_token), db: Session = Depends(get_db)):
    """Get user's favorite articles"""
    # CRITICAL FIX: Use joinedload to eagerly fetch the related 'article' data
    favorites = db.query(Favorite).options(
        joinedload(Favorite.article)
    ).filter(
        Favorite.user_id == current_user.id
    ).all()
    
    return favorites

@router.delete("/{favorite_id}")
def remove_favorite(favorite_id: str, current_user: User = Depends(verify_token), db: Session = Depends(get_db)):
    """Remove article from favorites"""
    favorite = db.query(Favorite).filter(
        (Favorite.id == favorite_id) & (Favorite.user_id == current_user.id)
    ).first()
    
    if not favorite:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Favorite not found")
    
    db.delete(favorite)
    db.commit()
    
    return {"message": "Removed from favorites"}