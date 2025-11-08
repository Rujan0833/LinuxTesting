import { useState, useEffect } from 'react';
import { watchAPI } from '../services/api';

function AdminDashboard() {
  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingWatch, setEditingWatch] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    description: '',
    price: '',
    image_url: '',
    stock: '',
  });

  useEffect(() => {
    fetchWatches();
  }, []);

  const fetchWatches = async () => {
    try {
      setLoading(true);
      const response = await watchAPI.getAllWatches();
      setWatches(response.data);
    } catch (err) {
      console.error('Error fetching watches:', err);
      alert('Failed to load watches');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const watchData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
    };

    try {
      if (editingWatch) {
        await watchAPI.updateWatch(editingWatch.id, watchData);
        alert('Watch updated successfully!');
      } else {
        await watchAPI.createWatch(watchData);
        alert('Watch created successfully!');
      }
      
      resetForm();
      fetchWatches();
    } catch (err) {
      console.error('Error saving watch:', err);
      alert(err.response?.data?.detail || 'Failed to save watch');
    }
  };

  const handleEdit = (watch) => {
    setEditingWatch(watch);
    setFormData({
      name: watch.name,
      brand: watch.brand,
      description: watch.description,
      price: watch.price.toString(),
      image_url: watch.image_url,
      stock: watch.stock.toString(),
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this watch?')) {
      return;
    }

    try {
      await watchAPI.deleteWatch(id);
      alert('Watch deleted successfully!');
      fetchWatches();
    } catch (err) {
      console.error('Error deleting watch:', err);
      alert('Failed to delete watch');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      description: '',
      price: '',
      image_url: '',
      stock: '',
    });
    setEditingWatch(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="text-2xl text-dark-red-light">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-dark-red hover:bg-dark-red-light text-white px-6 py-3 rounded font-semibold transition"
          >
            {showForm ? 'Cancel' : '+ Add New Watch'}
          </button>
        </div>

        {showForm && (
          <div className="bg-[#1a1a1a] p-8 rounded-lg mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingWatch ? 'Edit Watch' : 'Add New Watch'}
            </h2>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2 font-semibold">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black border border-gray-700 rounded text-white focus:outline-none focus:border-dark-red-light"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-semibold">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black border border-gray-700 rounded text-white focus:outline-none focus:border-dark-red-light"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2 font-semibold">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full px-4 py-2 bg-black border border-gray-700 rounded text-white focus:outline-none focus:border-dark-red-light"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-semibold">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 bg-black border border-gray-700 rounded text-white focus:outline-none focus:border-dark-red-light"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-semibold">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 bg-black border border-gray-700 rounded text-white focus:outline-none focus:border-dark-red-light"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2 font-semibold">Image URL</label>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black border border-gray-700 rounded text-white focus:outline-none focus:border-dark-red-light"
                />
              </div>

              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-dark-red hover:bg-dark-red-light text-white py-3 rounded font-semibold transition"
                >
                  {editingWatch ? 'Update Watch' : 'Create Watch'}
                </button>
                {editingWatch && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded font-semibold transition"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-black border-b border-dark-red">
              <tr>
                <th className="px-6 py-4 text-left text-white font-semibold">Brand</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Name</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Price</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Stock</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {watches.map((watch) => (
                <tr key={watch.id} className="border-b border-gray-700 hover:bg-black/50">
                  <td className="px-6 py-4 text-dark-red-light font-semibold">{watch.brand}</td>
                  <td className="px-6 py-4 text-white">{watch.name}</td>
                  <td className="px-6 py-4 text-white">${watch.price.toLocaleString()}</td>
                  <td className="px-6 py-4 text-white">{watch.stock}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEdit(watch)}
                      className="text-blue-400 hover:text-blue-300 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(watch.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {watches.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              No watches found. Add your first watch!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
