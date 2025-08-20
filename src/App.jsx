import { useEffect, useState } from 'react';
import LoginForm from './component/LoginForm';
import SignupForm from './component/SignupForm';
import TourList from './component/TourList';
import axios from 'axios';
function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSignup, setShowSignup] = useState(false);
  const [role, setRole] = useState(null);
  useEffect(() => {
    const checkToken = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    setLoading(false);
    return;
  }

  try {
    const res = await axios.get('http://localhost:3000/api/v1/tours', {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(res.data);
    // Use decoded user info from another request
    const userRes = await axios.get('http://localhost:3000/api/v1/users/:id', {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(userRes);
    setRole(userRes.data.data.user.role); // 👈 store role
    setLoggedIn(true);
  } catch (err) {
    console.log(err);
    localStorage.removeItem('token');
    setLoggedIn(false);
  }
  setLoading(false);
};
    checkToken();

    const handleUnload = () => {
      localStorage.removeItem('token');
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  if (loading) return <p className="text-center text-white bg-gray-900 h-screen flex items-center justify-center">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      {loggedIn ? (
        <TourList role={role} />
      ) : showSignup ? (
        <SignupForm onSignup={() => setShowSignup(false)} onSwitch={() => setShowSignup(false)} />
      ) : (
        <LoginForm onLogin={() => setLoggedIn(true)} onSwitch={() => setShowSignup(true)} />
      )}
    </div>
  );
}

export default App;
