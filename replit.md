# Luxury Watch E-Commerce Application

## Overview
A full-stack luxury watch e-commerce application demonstrating FastAPI best practices with JWT authentication, CRUD operations, and a React frontend with Tailwind CSS.

## Project Structure
```
.
├── backend/
│   ├── main.py           # FastAPI app setup and routes
│   ├── database.py       # SQLAlchemy database configuration
│   ├── models.py         # SQLAlchemy ORM models (User, Watch)
│   ├── schemas.py        # Pydantic validation schemas
│   ├── auth.py           # JWT authentication and password hashing
│   ├── crud.py           # Database CRUD operations
│   └── requirements.txt  # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/   # React components (Navbar, WatchCard, etc.)
│   │   ├── pages/        # Page components (Home, Login, Admin, etc.)
│   │   ├── services/     # API service layer
│   │   └── App.jsx       # Main app with routing
│   ├── vite.config.js    # Vite configuration
│   └── package.json      # Node.js dependencies
└── luxury_watches.db     # SQLite database (auto-generated)
```

## Technology Stack

### Backend (FastAPI)
- **FastAPI**: Modern web framework for building APIs
- **SQLAlchemy**: ORM for database operations
- **Pydantic**: Data validation and schema management
- **JWT (python-jose)**: Token-based authentication
- **Bcrypt (passlib)**: Password hashing
- **SQLite**: Lightweight database

### Frontend (React)
- **React 18**: UI library
- **Vite**: Build tool and dev server
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API requests

## Features Implemented
✅ User registration with email validation and password strength requirements
✅ User login with JWT token generation using environment-based secret key
✅ Admin user creation on startup
✅ Full CRUD operations for watches (admin only)
✅ Public watch listing and detail pages
✅ Protected routes for admin dashboard
✅ Responsive dark theme UI with dark red accents
✅ Sample luxury watch data pre-loaded
✅ Secure JWT secret management using environment variables

## Security Configuration

### JWT Secret Key
The application uses the `SESSION_SECRET` environment variable for JWT token signing. This secret is:
- **Never hard-coded** in source control
- Automatically available in Replit as a managed secret
- Required for the application to start
- Used to sign and verify all JWT authentication tokens

If running locally, generate a secure secret key:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Then set it as an environment variable:
```bash
export SESSION_SECRET="your-generated-secret-key"
```

### Password Security
- All passwords are hashed using **bcrypt** (work factor automatically managed)
- Passwords are **never stored in plain text**
- Password validation requires: minimum 8 characters, uppercase, lowercase, and digit
- Bcrypt version pinned to 4.0.1 for stability

## Default Credentials
- **Username**: admin
- **Password**: Admin123
- **Role**: Administrator

## Running the Application

### Backend
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm run dev
```

## API Endpoints

### Public Endpoints
- `GET /` - API health check
- `POST /register` - User registration
- `POST /login` - User login (returns JWT token)
- `GET /watches` - List all watches
- `GET /watches/{id}` - Get single watch

### Protected Endpoints (Require Authentication)
- `GET /users/me` - Get current user info

### Admin-Only Endpoints (Require Admin Token)
- `POST /watches` - Create new watch
- `PUT /watches/{id}` - Update watch
- `DELETE /watches/{id}` - Delete watch

## Learning Focus Areas

### FastAPI Best Practices
1. **Pydantic Validation**: All request/response models use Pydantic for automatic validation
2. **Dependency Injection**: Auth dependencies (`get_current_user`, `get_current_admin_user`) protect routes
3. **Password Security**: Bcrypt hashing, never storing plain passwords
4. **JWT Tokens**: Secure, stateless authentication
5. **CORS Configuration**: Proper middleware setup for frontend communication
6. **Error Handling**: HTTP exceptions with proper status codes
7. **Database Sessions**: Proper session management with `get_db` dependency
8. **Separation of Concerns**: Models, schemas, CRUD, and auth logic in separate files

### Key Pydantic Features Demonstrated
- Email validation with `EmailStr`
- Custom validators (`@field_validator`)
- Field constraints (`min_length`, `gt`, `ge`)
- Optional fields for partial updates
- `from_attributes` config for ORM compatibility

## Color Scheme
- Primary: `#8B0000` (Dark Red)
- Accent: `#DC143C` (Crimson)
- Background: `#000000` (Black)
- Secondary Background: `#1a1a1a` (Dark Gray)

## Sample Data
The application comes pre-loaded with 6 luxury watches:
1. Rolex Submariner Date
2. Patek Philippe Nautilus 5711
3. Omega Speedmaster Professional Moonwatch
4. Patek Philippe Calatrava 5196
5. Rolex Daytona
6. Omega Seamaster Diver 300M

## Database Schema

### Users Table
- id (Primary Key)
- username (Unique)
- email (Unique)
- hashed_password
- is_admin (Boolean)
- created_at (Timestamp)

### Watches Table
- id (Primary Key)
- name
- brand
- description
- price (Float)
- image_url
- stock (Integer)
- created_at (Timestamp)

## Recent Changes
- Initial project setup (November 8, 2025)
- Backend implementation with FastAPI
- Frontend implementation with React and Tailwind CSS
- Database initialization with sample data
- Complete authentication system
- Admin dashboard for watch management
