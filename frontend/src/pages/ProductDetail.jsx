import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { watchAPI } from '../services/api';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [watch, setWatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWatch();
  }, [id]);

  const fetchWatch = async () => {
    try {
      setLoading(true);
      const response = await watchAPI.getWatch(id);
      setWatch(response.data);
      setError(null);
    } catch (err) {
      setError('Watch not found');
      console.error('Error fetching watch:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="text-2xl text-dark-red-light">Loading...</div>
      </div>
    );
  }

  if (error || !watch) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-black">
        <div className="text-2xl text-red-500 mb-4">{error}</div>
        <button
          onClick={() => navigate('/')}
          className="bg-dark-red hover:bg-dark-red-light text-white px-6 py-2 rounded transition"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate('/')}
          className="text-dark-red-light hover:text-dark-red mb-8 flex items-center gap-2"
        >
          ← Back to Collection
        </button>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <img
              src={watch.image_url}
              alt={watch.name}
              className="w-full rounded-lg shadow-2xl"
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-dark-red-light font-semibold text-lg mb-2">
              {watch.brand}
            </p>
            <h1 className="text-4xl font-bold text-white mb-6">
              {watch.name}
            </h1>
            
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              {watch.description}
            </p>

            <div className="border-t border-b border-gray-700 py-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400 text-lg">Price</span>
                <span className="text-4xl font-bold text-dark-red-light">
                  ${watch.price.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-lg">Availability</span>
                <span className={`text-lg font-semibold ${watch.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {watch.stock > 0 ? `${watch.stock} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>

            <p className="text-gray-500 text-sm mb-6">
              Added on {new Date(watch.created_at).toLocaleDateString()}
            </p>

            <button
              disabled={watch.stock === 0}
              className={`w-full py-4 rounded-lg text-white font-semibold text-lg transition ${
                watch.stock > 0
                  ? 'bg-dark-red hover:bg-dark-red-light cursor-pointer'
                  : 'bg-gray-700 cursor-not-allowed'
              }`}
            >
              {watch.stock > 0 ? 'Inquire Now' : 'Currently Unavailable'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
