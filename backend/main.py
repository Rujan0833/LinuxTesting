"""
Main FastAPI application.

This file sets up the FastAPI app, configures CORS,
and defines all API endpoints.
"""

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from database import engine, get_db, Base
from models import User, Watch
import crud
import schemas
from auth import create_access_token, get_current_user, get_current_admin_user

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Luxury Watch E-Commerce API",
    description="FastAPI backend for luxury watch store with JWT authentication",
    version="1.0.0"
)

# Configure CORS to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """
    Initialize database with sample data on startup.
    
    Creates an admin user and sample watches if database is empty.
    """
    db = next(get_db())
    
    # Create admin user if no users exist
    if not db.query(User).first():
        admin_user = schemas.UserCreate(
            username="admin",
            email="admin@luxurywatches.com",
            password="Admin123"
        )
        crud.create_user(db, admin_user, is_admin=True)
        print("✅ Admin user created - Username: admin, Password: Admin123")
    
    # Create sample watches if no watches exist
    if not db.query(Watch).first():
        sample_watches = [
            schemas.WatchCreate(
                name="Submariner Date",
                brand="Rolex",
                description="The Rolex Submariner Date is the ultimate diving watch. Water-resistant to 300 meters, it features a unidirectional rotatable bezel and a self-winding mechanical movement with a 70-hour power reserve.",
                price=14300.00,
                image_url="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500",
                stock=3
            ),
            schemas.WatchCreate(
                name="Nautilus 5711",
                brand="Patek Philippe",
                description="The Patek Philippe Nautilus is an icon of luxury sports watches. Featuring an elegant octagonal bezel and horizontal embossed dial, this self-winding watch represents the pinnacle of fine watchmaking.",
                price=52635.00,
                image_url="https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=500",
                stock=1
            ),
            schemas.WatchCreate(
                name="Speedmaster Professional Moonwatch",
                brand="Omega",
                description="The Omega Speedmaster Professional Moonwatch is the first watch worn on the moon. This manual-winding chronograph features a hesalite crystal and has been flight-qualified by NASA for all manned space missions.",
                price=6395.00,
                image_url="https://images.unsplash.com/photo-1587836374058-4ec0f0e4b6fb?w=500",
                stock=5
            ),
            schemas.WatchCreate(
                name="Calatrava 5196",
                brand="Patek Philippe",
                description="The Patek Philippe Calatrava embodies the essence of the classic round watch. With its clean lines and understated elegance, this hand-wound dress watch is a masterpiece of refined simplicity.",
                price=28420.00,
                image_url="https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=500",
                stock=2
            ),
            schemas.WatchCreate(
                name="Daytona",
                brand="Rolex",
                description="The Rolex Cosmograph Daytona is a legendary chronograph designed for professional race car drivers. Featuring a tachymetric scale bezel and self-winding movement, it's the ultimate tool for measuring elapsed time and calculating average speed.",
                price=34650.00,
                image_url="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=500",
                stock=2
            ),
            schemas.WatchCreate(
                name="Seamaster Diver 300M",
                brand="Omega",
                description="The Omega Seamaster Diver 300M combines style and technical performance. Water-resistant to 300 meters, it features a helium escape valve, unidirectional bezel, and Co-Axial Master Chronometer certification.",
                price=5400.00,
                image_url="https://images.unsplash.com/photo-1606390658827-aca5e5734971?w=500",
                stock=4
            )
        ]
        
        for watch_data in sample_watches:
            crud.create_watch(db, watch_data)
        
        print(f"✅ {len(sample_watches)} sample watches created")
    
    db.close()


@app.get("/")
def read_root():
    """Root endpoint - API health check."""
    return {
        "message": "Welcome to Luxury Watch E-Commerce API",
        "docs": "/docs",
        "status": "operational"
    }


@app.post("/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user.
    
    Validates:
    - Email format (Pydantic EmailStr)
    - Password strength (minimum 8 chars, uppercase, lowercase, digit)
    - Username uniqueness
    - Email uniqueness
    """
    # Check if username already exists
    db_user = crud.get_user_by_username(db, user.username)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Check if email already exists
    db_user = crud.get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    return crud.create_user(db, user)


@app.post("/login", response_model=schemas.Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    User login endpoint.
    
    Authenticates user and returns JWT access token.
    Token should be included in subsequent requests as:
    Authorization: Bearer <token>
    """
    user = crud.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/users/me", response_model=schemas.UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user's information.
    
    Requires: Valid JWT token in Authorization header
    """
    return current_user


@app.get("/watches", response_model=List[schemas.WatchResponse])
def list_watches(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Get all watches (public endpoint).
    
    Query parameters:
    - skip: Number of records to skip (pagination)
    - limit: Maximum number of records to return
    """
    watches = crud.get_watches(db, skip=skip, limit=limit)
    return watches


@app.get("/watches/{watch_id}", response_model=schemas.WatchResponse)
def get_watch(watch_id: int, db: Session = Depends(get_db)):
    """
    Get a single watch by ID (public endpoint).
    
    Raises 404 if watch not found.
    """
    watch = crud.get_watch(db, watch_id)
    if not watch:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Watch not found"
        )
    return watch


@app.post("/watches", response_model=schemas.WatchResponse, status_code=status.HTTP_201_CREATED)
def create_watch(
    watch: schemas.WatchCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Create a new watch (admin only).
    
    Requires: Valid JWT token with admin privileges
    """
    return crud.create_watch(db, watch)


@app.put("/watches/{watch_id}", response_model=schemas.WatchResponse)
def update_watch(
    watch_id: int,
    watch: schemas.WatchUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Update a watch (admin only).
    
    Requires: Valid JWT token with admin privileges
    Supports partial updates - only provided fields will be updated.
    """
    updated_watch = crud.update_watch(db, watch_id, watch)
    if not updated_watch:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Watch not found"
        )
    return updated_watch


@app.delete("/watches/{watch_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_watch(
    watch_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Delete a watch (admin only).
    
    Requires: Valid JWT token with admin privileges
    """
    success = crud.delete_watch(db, watch_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Watch not found"
        )
    return None
