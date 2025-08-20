import { useEffect, useState } from 'react';
import axios from 'axios';

function TourList({ role }) {
  const [tours, setTours] = useState([]);
  const [form, setForm] = useState({
    name: '',
    price: '',
    summary: '',
    duration: '',
    maxGroupSize: '',
    difficulty: 'easy',
    imageCover: 'default.jpg',
  });

  const token = localStorage.getItem('token');

  const fetchTours = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:3000/api/v1/tours', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTours(res.data.data.tours);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch tours');
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const createTour = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:3000/api/v1/tours', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({
        name: '',
        price: '',
        summary: '',
        duration: '',
        maxGroupSize: '',
        difficulty: 'easy',
        imageCover: 'default.jpg',
      });
      fetchTours();
    } catch (err) {
      console.error(err);
      alert('Failed to create tour');
    }
  };

  const deleteTour = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tour?')) return;
    try {
      await axios.delete(`http://127.0.0.1:3000/api/v1/tours/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTours();
    } catch (err) {
      console.error(err);
      alert('Failed to delete tour');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-400">All Tours</h2>

      {(role === 'admin' || role === 'lead-guide') && (<form onSubmit={createTour} className="bg-gray-800 rounded-xl p-6 max-w-2xl mx-auto mb-10 space-y-4 shadow-lg">
        <h3 className="text-xl font-semibold text-white">Create New Tour</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
            placeholder="Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="px-4 py-2 rounded bg-gray-700 border border-gray-600"
            placeholder="Price"
            required
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <input
            className="px-4 py-2 rounded bg-gray-700 border border-gray-600"
            placeholder="Summary"
            required
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
          />
          <input
            className="px-4 py-2 rounded bg-gray-700 border border-gray-600"
            placeholder="Duration (in days)"
            required
            type="number"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
          />
          <input
            className="px-4 py-2 rounded bg-gray-700 border border-gray-600"
            placeholder="Max Group Size"
            required
            type="number"
            value={form.maxGroupSize}
            onChange={(e) => setForm({ ...form, maxGroupSize: e.target.value })}
          />
          <select
            className="px-4 py-2 rounded bg-gray-700 border border-gray-600"
            value={form.difficulty}
            onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="difficult">Difficult</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white font-semibold mt-2 w-full"
        >
          Create Tour
        </button>
      </form>
)}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tours.map((tour) => (
          <div key={tour._id} className="bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300 relative">
            <h3 className="text-xl font-semibold text-white mb-2">{tour.name}</h3>
            <p className="text-sm text-gray-300 mb-2">{tour.summary}</p>
            <p className="text-lg text-green-400 font-bold mb-2">₹{tour.price}</p>
            {(role === 'admin' || role === 'lead-guide') && (
                <button onClick={() => deleteTour(tour._id)} className="absolute top-3 right-3 text-sm bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-white">
                    Delete
                </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TourList;
