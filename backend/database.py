"""
Database configuration and session management.

This module sets up SQLAlchemy with SQLite and provides
a database session dependency for FastAPI routes.
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLite database URL - creates a file named luxury_watches.db
SQLALCHEMY_DATABASE_URL = "sqlite:///./luxury_watches.db"

# Create SQLAlchemy engine
# check_same_thread=False is needed only for SQLite to allow multiple threads
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False}
)

# Create SessionLocal class for database sessions
# Each instance will be an actual database session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for our database models
Base = declarative_base()


def get_db():
    """
    Dependency function that provides a database session to route handlers.
    
    This is used with FastAPI's dependency injection system.
    The session is automatically closed after the request is complete.
    
    Yields:
        Session: SQLAlchemy database session
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
