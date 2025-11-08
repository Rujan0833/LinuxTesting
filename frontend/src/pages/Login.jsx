import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      localStorage.setItem('token', response.data.access_token);
      
      const userResponse = await authAPI.getCurrentUser();
      localStorage.setItem('isAdmin', userResponse.data.is_admin);
      
      navigate('/');
      window.location.reload();
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400">Login to access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#1a1a1a] p-8 rounded-lg shadow-xl">
          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-gray-300 mb-2 font-semibold">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded text-white focus:outline-none focus:border-dark-red-light"
              placeholder="Enter username"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 mb-2 font-semibold">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded text-white focus:outline-none focus:border-dark-red-light"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-dark-red hover:bg-dark-red-light text-white py-3 rounded font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className="text-center text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-dark-red-light hover:underline">
              Register here
            </Link>
          </p>

          <div className="mt-6 p-4 bg-black/50 rounded border border-gray-700">
            <p className="text-gray-400 text-sm text-center mb-2">Test Credentials:</p>
            <p className="text-gray-300 text-sm text-center">
              <strong>Username:</strong> admin<br />
              <strong>Password:</strong> Admin123
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
