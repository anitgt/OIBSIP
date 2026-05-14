import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, totalAmount } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const navigate = useNavigate();

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => { if (document.body.contains(script)) document.body.removeChild(script); };
  }, []);

  const handleCheckout = async () => {
    if (cartItems.length === 0) { alert('Your cart is empty!'); return; }
    if (!window.Razorpay) { alert('Payment gateway not loaded. Refresh and try again.'); return; }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const amountInPaise = totalAmount * 100;

      // Prepare items for backend
      const itemsToOrder = cartItems.map(item => ({
        name: item.name || 'Custom Pizza',
        type: item.type || 'custom',
        price: item.price,
        selection: item.selection || null
      }));

      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ items: itemsToOrder, amount: amountInPaise }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create order');

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: 'INR',
        name: 'Pizzeria 🍕',
        description: `Order of ${cartItems.length} item(s)`,
        order_id: data.orderId,
        handler: async (response) => {
          const verifyRes = await fetch('http://localhost:5000/api/orders/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(response),
          });
          if (verifyRes.ok) {
            clearCart();
            setOrderSuccess(true);
          } else {
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: { name: user.name || 'Pizza Lover', email: user.email || '', contact: '9999999999' },
        theme: { color: '#ff6b6b' },
        modal: { ondismiss: () => setLoading(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (r) => {
        alert('Payment failed: ' + r.error.description);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="dashboard-container">
        <nav className="dashboard-nav">
          <h1>Pizzeria 🍕</h1>
          <button className="btn-logout" onClick={() => navigate('/dashboard')}>Back to Menu</button>
        </nav>
        <div className="order-success-container">
          <div className="order-success-card">
            <div className="success-icon-ring">
              <span className="success-icon">✓</span>
            </div>
            <h2 className="success-title">Order Placed Successfully!</h2>
            <p className="success-subtitle">Your delicious pizza is on its way 🛵</p>
            <div className="delivery-banner">
              <span className="delivery-icon">🚚</span>
              <span className="delivery-text">Order Confirmed — Estimated 30 mins</span>
            </div>
            <div className="success-actions">
              <button className="btn-primary" style={{ width: 'auto', padding: '0.9rem 2.5rem' }} onClick={() => navigate('/dashboard')}>
                🍕 Order More
              </button>
              <button className="btn-secondary" onClick={() => navigate('/custom-pizza')}>
                Build Another Pizza
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
        <nav className="dashboard-nav">
          <h1 className="clickable-logo" onClick={() => navigate('/dashboard')}>Pizzeria 🍕</h1>
          <button className="btn-logout" onClick={() => navigate('/dashboard')}>Back to Menu</button>
        </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 className="cart-page-title">🛒 Your Cart</h2>

        {cartItems.length === 0 ? (
          <div className="glass-panel cart-empty">
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🍕</div>
            <h3 style={{ color: '#ccc', marginBottom: '0.5rem' }}>Your cart is empty</h3>
            <p style={{ color: '#666', marginBottom: '2rem' }}>Add some delicious pizzas to get started!</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn-primary" style={{ width: 'auto', padding: '0.8rem 2rem' }} onClick={() => navigate('/dashboard')}>
                View Menu
              </button>
              <button className="btn-secondary" style={{ width: 'auto', padding: '0.8rem 2rem' }} onClick={() => navigate('/custom-pizza')}>
                + Create Custom Pizza
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="cart-items-list">
              {cartItems.map((item, index) => (
                <div key={item.cartId} className="cart-item-card glass-panel">
                  <div className="cart-item-left">
                    <div className="cart-item-emoji">{item.image ? <img src={item.image} style={{ width: '50px', borderRadius: '8px' }} alt="" /> : '🍕'}</div>
                    <div className="cart-item-info">
                      <h3 className="cart-item-name">{item.name || `Custom Pizza #${index + 1}`}</h3>
                      <div className="cart-item-details">
                        {item.selection ? (
                          <>
                            {item.selection.base && <span className="cart-detail-badge">🫓 {item.selection.base}</span>}
                            {item.selection.sauce && <span className="cart-detail-badge">🍅 {item.selection.sauce}</span>}
                            {item.selection.cheese && <span className="cart-detail-badge">🧀 {item.selection.cheese}</span>}
                            {item.selection.veggies?.length > 0 && (
                              <span className="cart-detail-badge">🥦 {item.selection.veggies.join(', ')}</span>
                            )}
                          </>
                        ) : (
                          <span className="cart-detail-badge">Menu Pizza</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="cart-item-right">
                    <span className="cart-item-price">₹{item.price || 499}</span>
                    <button className="cart-remove-btn" onClick={() => removeFromCart(item.cartId)}>🗑️ Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary glass-panel">
              <h3 style={{ marginBottom: '1.5rem', color: '#fff' }}>Order Summary</h3>
              <div className="cart-summary-row">
                <span style={{ color: '#aaa' }}>Items ({cartItems.length})</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="cart-summary-row">
                <span style={{ color: '#aaa' }}>Delivery</span>
                <span style={{ color: '#4ecdc4' }}>FREE</span>
              </div>
              <div className="cart-summary-divider"></div>
              <div className="cart-summary-row cart-total-row">
                <span>Total</span>
                <span className="cart-total-price">₹{totalAmount}</span>
              </div>
              <button
                className="btn-primary cart-checkout-btn"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? '⏳ Processing...' : `💳 Proceed to Pay ₹${totalAmount}`}
              </button>
              <button className="cart-clear-btn" onClick={clearCart}>Clear Cart</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
