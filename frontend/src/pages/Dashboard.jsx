import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [pizzas, setPizzas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/pizzas', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPizzas(response.data);
      } catch (error) {
        console.error('Failed to fetch pizzas:', error);
      }
    };
    fetchPizzas();
  }, []);

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: 'white' }}>Welcome, {user.name}!</span>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      
      <div className="glass-panel" style={{ maxWidth: '100%', padding: '2rem' }}>
        <h2 style={{ textAlign: 'left', marginBottom: '0.5rem' }}>Our Menu</h2>
        <p style={{ color: '#aaa', marginBottom: '1rem' }}>Freshly baked pizzas for you.</p>
        
        <div className="pizza-grid">
          {pizzas.map((pizza) => (
            <div key={pizza._id} className="pizza-card">
              <img src={pizza.image} alt={pizza.name} className="pizza-image" />
              <div className="pizza-info">
                <div className="pizza-header">
                  <h3 className="pizza-name">{pizza.name}</h3>
                  <span className={`pizza-category ${pizza.category === 'Veg' ? 'cat-veg' : 'cat-non-veg'}`}>
                    {pizza.category}
                  </span>
                </div>
                <p className="pizza-desc">{pizza.description}</p>
                <div className="pizza-footer">
                  <span className="pizza-price">${pizza.price.toFixed(2)}</span>
                  <button className="btn-order">Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
