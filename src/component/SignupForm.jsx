import { useState } from 'react';
import axios from 'axios';
import '../App.css';
function SignupForm({ onSignup, onSwitch }) {
  const [form, setForm] = useState({
    name: '', email: '', password: '', passwordConfirm: ''
  });

  const signup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:3000/api/v1/users/signup', form);
      alert("Signup successful! Please login.");
      onSignup(); // switch back to login
    } catch (err) {
      console.error(err);
      alert('Signup failed');
    }
  };

  return (
    <div className="bg-gray-800 shadow-lg rounded-xl p-8 w-full max-w-md space-y-4">
      <h2 className="text-2xl font-bold text-center text-green-400">Signup</h2>
      <form onSubmit={signup} className="space-y-4">
        <input
          className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Name"
          required
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email"
          required
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Password"
          required
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        <input
          type="password"
          className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Confirm Password"
          required
          onChange={e => setForm({ ...form, passwordConfirm: e.target.value })}
        />
        <button
          type="submit"
          className="w-full py-2 bg-green-600 hover:bg-green-700 rounded-md text-white font-semibold"
        >
          Sign Up
        </button>
      </form>

      <button
        onClick={onSwitch}
        className="w-full text-sm text-gray-300 hover:text-white mt-2 underline"
      >
        Already have an account? Login
      </button>
    </div>
  );
}

export default SignupForm;
