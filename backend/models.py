"""
SQLAlchemy database models.

Defines the database table structures for User and Watch entities.
"""

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.sql import func
from database import Base


class User(Base):
    """
    User model for authentication and authorization.
    
    Attributes:
        id: Primary key
        username: Unique username for login
        email: Unique email address (validated)
        hashed_password: Bcrypt hashed password (never store plain text!)
        is_admin: Boolean flag for admin privileges
        created_at: Timestamp of account creation
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Watch(Base):
    """
    Watch model for luxury watch products.
    
    Attributes:
        id: Primary key
        name: Watch model name
        brand: Watch brand (e.g., Rolex, Patek Philippe)
        description: Detailed description of the watch
        price: Price in USD
        image_url: URL to watch image
        stock: Available quantity
        created_at: Timestamp when watch was added to catalog
    """
    __tablename__ = "watches"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    brand = Column(String, nullable=False, index=True)
    description = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    image_url = Column(String, nullable=False)
    stock = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
