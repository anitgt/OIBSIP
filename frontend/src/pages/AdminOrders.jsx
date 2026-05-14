import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/orders', {
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
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/orders/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div className="app-container"><div className="glass-panel">Loading Orders...</div></div>;
  if (error) return <div className="app-container"><div className="glass-panel error-message">{error}</div></div>;

  const statusOptions = ['paid', 'order received', 'in the kitchen', 'sent to delivery', 'delivered'];

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h1 className="clickable-logo" onClick={() => navigate('/dashboard')}>Admin Orders</h1>
        <button className="btn-logout" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </nav>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {orders.length === 0 ? (
          <div className="glass-panel">No orders found.</div>
        ) : (
          orders.map(order => (
            <div key={order._id} className="glass-panel" style={{ maxWidth: 'none', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0 }}>Order #{order.razorpayOrderId.slice(-6)}</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '5px 0 0' }}>
                    Customer: {order.userId?.name} ({order.userId?.email})
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                    ₹{(order.amount / 100).toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {new Date(order.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <h4 style={{ marginBottom: '1rem' }}>Items:</h4>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ marginBottom: '0.5rem', padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '4px' }}>
                      <strong>{item.name}</strong>
                      {item.type === 'custom' && item.selection && (
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
                          {item.selection.base}, {item.selection.sauce}, {item.selection.cheese}
                          {item.selection.veggies?.length > 0 && ` + ${item.selection.veggies.join(', ')}`}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div style={{ textAlign: 'right' }}>
                  <h4 style={{ marginBottom: '1rem' }}>Update Status:</h4>
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    style={{ 
                      padding: '0.8rem', 
                      borderRadius: '8px', 
                      background: '#000', 
                      color: '#fff', 
                      border: '1px solid var(--glass-border)',
                      width: '100%',
                      maxWidth: '250px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      textTransform: 'capitalize',
                      cursor: 'pointer'
                    }}
                  >
                    {statusOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                    {order.status === 'failed' && <option value="failed">failed</option>}
                  </select>
                  
                  <div style={{ marginTop: '1rem' }}>
                    <span style={{ 
                      padding: '0.4rem 1rem', 
                      borderRadius: '20px', 
                      fontSize: '0.85rem', 
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      background: order.status === 'delivered' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 107, 107, 0.1)',
                      color: order.status === 'delivered' ? '#22c55e' : 'var(--primary-color)',
                      border: `1px solid ${order.status === 'delivered' ? '#22c55e33' : 'var(--primary-color)33'}`
                    }}>
                      Current: {order.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
