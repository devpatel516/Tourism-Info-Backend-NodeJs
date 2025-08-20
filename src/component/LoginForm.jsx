import { useState } from 'react';
import axios from 'axios';

function LoginForm({ onLogin, onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:3000/api/v1/users/login', {
        email,
        password
      });
      localStorage.setItem('token', res.data.token);
      onLogin();
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  return (
    <div className="bg-gray-800 shadow-lg rounded-xl p-8 w-full max-w-md space-y-4">
      <h2 className="text-2xl font-bold text-center text-green-400">Login</h2>
      <form onSubmit={login} className="space-y-4">
        <input
          className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" className="w-full py-2 bg-green-600 hover:bg-green-700 rounded-md text-white font-semibold">
          Login
        </button>
      </form>

      <button
        onClick={onSwitch}
        className="w-full text-sm text-gray-300 hover:text-white mt-2 underline"
      >
        Don't have an account? Signup
      </button>
    </div>
  );
}

export default LoginForm;
