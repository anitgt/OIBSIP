import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/inventory', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInventory(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load inventory');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleUpdateStock = async (id, newStock) => {
    setUpdatingId(id);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/inventory/${id}`, 
        { stock: parseInt(newStock) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchInventory();
    } catch (err) {
      alert('Update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <div className="app-container"><div className="glass-panel">Loading Inventory...</div></div>;
  if (error) return <div className="app-container"><div className="glass-panel error-message">{error}</div></div>;

  const categories = ['base', 'sauce', 'cheese', 'veggies', 'meat'];

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h1 className="clickable-logo" onClick={() => navigate('/dashboard')}>Admin Inventory</h1>
        <button className="btn-logout" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </nav>

      <div className="inventory-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {categories.map(cat => (
          <div key={cat} className="glass-panel" style={{ padding: '1.5rem', maxWidth: 'none' }}>
            <h3 style={{ textTransform: 'capitalize', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
              {cat === 'base' ? '🍕 Bases' : 
               cat === 'sauce' ? '🍅 Sauces' : 
               cat === 'cheese' ? '🧀 Cheeses' : 
               cat === 'veggies' ? '🥦 Veggies' : '🥩 Meats'}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {inventory.filter(item => item.category === cat).map(item => (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px' }}>
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ fontWeight: '600' }}>{item.name}</div>
                    <div style={{ fontSize: '0.8rem', color: item.stock < 10 ? '#ff6b6b' : '#94a3b8' }}>
                      Stock: {item.stock} {item.unit} {item.stock < 10 && '⚠️ Low'}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input 
                      type="number" 
                      defaultValue={item.stock}
                      style={{ width: '60px', padding: '0.4rem', borderRadius: '4px', background: '#000', color: '#fff', border: '1px solid #444' }}
                      onBlur={(e) => {
                        if (e.target.value !== String(item.stock)) {
                          handleUpdateStock(item._id, e.target.value);
                        }
                      }}
                    />
                    {updatingId === item._id && <span style={{ fontSize: '0.7rem' }}>⌛</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminInventory;
