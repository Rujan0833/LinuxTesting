"""
CRUD (Create, Read, Update, Delete) operations.

These functions handle all database operations for users and watches.
They are separated from route handlers for better organization and reusability.
"""

from sqlalchemy.orm import Session
from models import User, Watch
from schemas import UserCreate, WatchCreate, WatchUpdate
from auth import get_password_hash


def get_user_by_username(db: Session, username: str):
    """Get a user by username."""
    return db.query(User).filter(User.username == username).first()


def get_user_by_email(db: Session, email: str):
    """Get a user by email."""
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, user: UserCreate, is_admin: bool = False):
    """
    Create a new user with hashed password.
    
    Args:
        db: Database session
        user: UserCreate schema with validated data
        is_admin: Whether to create an admin user
        
    Returns:
        User: The created user object
    """
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        is_admin=is_admin
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, username: str, password: str):
    """
    Authenticate a user by username and password.
    
    Args:
        db: Database session
        username: Username to authenticate
        password: Plain text password
        
    Returns:
        User: The authenticated user, or None if authentication failed
    """
    from auth import verify_password
    
    user = get_user_by_username(db, username)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def get_watches(db: Session, skip: int = 0, limit: int = 100):
    """
    Get all watches with pagination.
    
    Args:
        db: Database session
        skip: Number of records to skip (for pagination)
        limit: Maximum number of records to return
        
    Returns:
        List[Watch]: List of watch objects
    """
    return db.query(Watch).offset(skip).limit(limit).all()


def get_watch(db: Session, watch_id: int):
    """
    Get a single watch by ID.
    
    Args:
        db: Database session
        watch_id: Watch ID
        
    Returns:
        Watch: The watch object, or None if not found
    """
    return db.query(Watch).filter(Watch.id == watch_id).first()


def create_watch(db: Session, watch: WatchCreate):
    """
    Create a new watch.
    
    Args:
        db: Database session
        watch: WatchCreate schema with validated data
        
    Returns:
        Watch: The created watch object
    """
    db_watch = Watch(**watch.model_dump())
    db.add(db_watch)
    db.commit()
    db.refresh(db_watch)
    return db_watch


def update_watch(db: Session, watch_id: int, watch: WatchUpdate):
    """
    Update an existing watch.
    
    Args:
        db: Database session
        watch_id: Watch ID to update
        watch: WatchUpdate schema with fields to update
        
    Returns:
        Watch: The updated watch object, or None if not found
    """
    db_watch = get_watch(db, watch_id)
    if not db_watch:
        return None
    
    # Update only provided fields
    update_data = watch.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_watch, field, value)
    
    db.commit()
    db.refresh(db_watch)
    return db_watch


def delete_watch(db: Session, watch_id: int):
    """
    Delete a watch.
    
    Args:
        db: Database session
        watch_id: Watch ID to delete
        
    Returns:
        bool: True if deleted, False if not found
    """
    db_watch = get_watch(db, watch_id)
    if not db_watch:
        return False
    
    db.delete(db_watch)
    db.commit()
    return True
