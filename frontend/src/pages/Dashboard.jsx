import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h1>Pizzeria</h1>
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </nav>
      
      <div className="glass-panel" style={{ maxWidth: '100%' }}>
        <h2>Welcome, {user.name}!</h2>
        <p style={{ marginTop: '1rem', color: '#aaa' }}>
          Role: <strong style={{ color: 'white' }}>{user.role}</strong>
        </p>
        <p style={{ marginTop: '0.5rem', color: '#aaa' }}>
          Email: <strong style={{ color: 'white' }}>{user.email}</strong>
        </p>
        
        {user.role === 'admin' ? (
          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255, 107, 107, 0.1)', borderRadius: '8px' }}>
            <h3>Admin Controls</h3>
            <p style={{ marginTop: '0.5rem' }}>You have access to the admin dashboard.</p>
            {/* Admin specific features like managing orders, users, etc. would go here */}
          </div>
        ) : (
          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
            <h3>User Area</h3>
            <p style={{ marginTop: '0.5rem' }}>You can view the menu and place orders here.</p>
            {/* User specific features like ordering pizza would go here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
