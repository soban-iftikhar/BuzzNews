from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# Auth Schemas
class UserSignup(BaseModel):
    email: EmailStr
    username: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    username: str
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Article Schemas
class ArticleCreate(BaseModel):
    title: str
    description: Optional[str]
    content: Optional[str]
    image_url: Optional[str]
    url: Optional[str]

class ArticleResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    content: Optional[str]
    author_id: Optional[str]
    source: str
    image_url: Optional[str]
    url: Optional[str]
    published_at: datetime
    created_at: datetime

    class Config:
        from_attributes = True

# Favorite Schemas
class FavoriteCreate(BaseModel):
    article_id: str

class FavoriteResponse(BaseModel):
    id: str
    article_id: str
    created_at: datetime
    article: ArticleResponse

    class Config:
        from_attributes = True

# Watch Later Schemas
class WatchLaterCreate(BaseModel):
    article_id: str

class WatchLaterResponse(BaseModel):
    id: str
    article_id: str
    created_at: datetime
    article: ArticleResponse

    class Config:
        from_attributes = True
