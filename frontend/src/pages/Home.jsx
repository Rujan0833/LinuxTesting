import { useState, useEffect } from 'react';
import { watchAPI } from '../services/api';
import WatchCard from '../components/WatchCard';

function Home() {
  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWatches();
  }, []);

  const fetchWatches = async () => {
    try {
      setLoading(true);
      const response = await watchAPI.getAllWatches();
      setWatches(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load watches. Please try again later.');
      console.error('Error fetching watches:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl text-dark-red-light">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Luxury Timepieces
          </h1>
          <p className="text-xl text-gray-400">
            Discover the finest collection of luxury watches
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {watches.map((watch) => (
            <WatchCard key={watch.id} watch={watch} />
          ))}
        </div>

        {watches.length === 0 && (
          <div className="text-center text-gray-400 text-xl mt-12">
            No watches available at the moment.
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
