import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
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
      await authAPI.register(formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Registration failed. Please check your information.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-gray-400">Join our exclusive luxury watch collection</p>
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
              minLength={3}
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded text-white focus:outline-none focus:border-dark-red-light"
              placeholder="Enter username"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 mb-2 font-semibold">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded text-white focus:outline-none focus:border-dark-red-light"
              placeholder="Enter email"
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
              minLength={8}
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded text-white focus:outline-none focus:border-dark-red-light"
              placeholder="Enter password (min 8 chars, uppercase, lowercase, digit)"
            />
            <p className="text-gray-500 text-sm mt-2">
              Password must contain: uppercase, lowercase, digit, min 8 characters
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-dark-red hover:bg-dark-red-light text-white py-3 rounded font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>

          <p className="text-center text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-dark-red-light hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
