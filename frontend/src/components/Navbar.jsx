import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const admin = localStorage.getItem('isAdmin') === 'true';
    setIsLoggedIn(!!token);
    setIsAdmin(admin);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate('/');
  };

  return (
    <nav className="bg-black border-b border-dark-red">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-dark-red-light">
            LUXURY WATCHES
          </Link>
          
          <div className="flex gap-6 items-center">
            <Link to="/" className="text-white hover:text-dark-red-light transition">
              Home
            </Link>
            
            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="text-white hover:text-dark-red-light transition">
                    Admin
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="bg-dark-red hover:bg-dark-red-light text-white px-4 py-2 rounded transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-dark-red-light transition">
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="bg-dark-red hover:bg-dark-red-light text-white px-4 py-2 rounded transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
