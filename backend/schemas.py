"""
Pydantic schemas for request/response validation.

These models validate incoming data and serialize outgoing data.
They provide automatic type checking, data validation, and API documentation.
"""

from pydantic import BaseModel, EmailStr, Field, field_validator
from datetime import datetime
from typing import Optional
import re


class UserCreate(BaseModel):
    """
    Schema for user registration.
    
    Validates username, email format, and password strength.
    """
    username: str = Field(..., min_length=3, max_length=50, description="Unique username")
    email: EmailStr = Field(..., description="Valid email address")
    password: str = Field(..., min_length=8, description="Password (minimum 8 characters)")
    
    @field_validator('password')
    @classmethod
    def validate_password_strength(cls, v):
        """
        Validates password strength requirements.
        
        Requirements:
        - At least 8 characters
        - At least one uppercase letter
        - At least one lowercase letter
        - At least one digit
        """
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit')
        return v


class UserLogin(BaseModel):
    """Schema for user login."""
    username: str
    password: str


class UserResponse(BaseModel):
    """
    Schema for user data in responses.
    
    Note: Never include password in responses!
    """
    id: int
    username: str
    email: str
    is_admin: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    """Schema for JWT token response."""
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Schema for data stored in JWT token."""
    username: Optional[str] = None


class WatchCreate(BaseModel):
    """
    Schema for creating a new watch.
    
    Admin only operation.
    """
    name: str = Field(..., min_length=1, max_length=200)
    brand: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=10)
    price: float = Field(..., gt=0, description="Price must be greater than 0")
    image_url: str = Field(..., min_length=1)
    stock: int = Field(default=0, ge=0, description="Stock must be 0 or greater")


class WatchUpdate(BaseModel):
    """
    Schema for updating a watch.
    
    All fields are optional to allow partial updates.
    """
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    brand: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, min_length=10)
    price: Optional[float] = Field(None, gt=0)
    image_url: Optional[str] = Field(None, min_length=1)
    stock: Optional[int] = Field(None, ge=0)


class WatchResponse(BaseModel):
    """Schema for watch data in responses."""
    id: int
    name: str
    brand: str
    description: str
    price: float
    image_url: str
    stock: int
    created_at: datetime
    
    class Config:
        from_attributes = True
