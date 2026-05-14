import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Poll for status changes every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="app-container"><div className="glass-panel">Loading Your Orders...</div></div>;
  if (error) return <div className="app-container"><div className="glass-panel error-message">{error}</div></div>;

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h1 className="clickable-logo" onClick={() => navigate('/dashboard')}>My Order Status</h1>
        <button className="btn-logout" onClick={() => navigate('/dashboard')}>Back to Menu</button>
      </nav>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {orders.length === 0 ? (
          <div className="glass-panel">
            <h2 style={{ marginBottom: '1rem' }}>No orders yet! 🍕</h2>
            <button className="btn-primary" onClick={() => navigate('/dashboard')}>Order Now</button>
          </div>
        ) : (
          orders.map(order => (
            <div key={order._id} className="glass-panel" style={{ maxWidth: 'none', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Order #{order.razorpayOrderId.slice(-6)}</span>
                  <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
                <div style={{ 
                  padding: '0.4rem 1.2rem', 
                  borderRadius: '20px', 
                  fontSize: '0.9rem', 
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  background: order.status === 'delivered' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 107, 107, 0.1)',
                  color: order.status === 'delivered' ? '#22c55e' : 'var(--primary-color)',
                  border: `1px solid ${order.status === 'delivered' ? '#22c55e33' : 'var(--primary-color)33'}`,
                  boxShadow: order.status === 'delivered' ? 'none' : '0 0 15px rgba(255, 107, 107, 0.1)'
                }}>
                  {order.status}
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                {order.items.map((item, idx) => (
                  <div key={idx} className="summary-badge" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    {item.name}
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                  Total: <span style={{ color: '#fff', fontWeight: 'bold' }}>₹{(order.amount / 100).toFixed(2)}</span>
                </div>
                {order.status === 'order received' && <div style={{ fontSize: '0.8rem', color: '#4ecdc4' }}>👨‍🍳 The chef is reviewing your order!</div>}
                {order.status === 'in the kitchen' && <div style={{ fontSize: '0.8rem', color: '#ff9f43' }}>🔥 Your pizza is in the oven!</div>}
                {order.status === 'sent to delivery' && <div style={{ fontSize: '0.8rem', color: '#3498db' }}>🛵 Out for delivery! Get ready!</div>}
                {order.status === 'delivered' && <div style={{ fontSize: '0.8rem', color: '#2ecc71' }}>✅ Enjoy your meal!</div>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrders;
