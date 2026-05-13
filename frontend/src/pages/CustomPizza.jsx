import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const bases = ['Thin Crust', 'Hand Tossed', 'Cheese Burst', 'Pan Pizza', 'Cauliflower Crust'];
const sauces = ['Classic Tomato', 'Spicy Marinara', 'BBQ Sauce', 'Garlic Parmesan', 'Pesto'];
const cheeses = ['Mozzarella', 'Cheddar', 'Provolone', 'Vegan Cheese', 'Parmesan'];
const veggiesList = ['Onions', 'Tomatoes', 'Capsicum', 'Olives', 'Jalapenos', 'Mushrooms', 'Corn', 'Spinach'];

const CustomPizza = () => {
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState({
    base: '',
    sauce: '',
    cheese: '',
    veggies: []
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load Razorpay script on mount
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const handleSelect = (category, value) => {
    setSelection({ ...selection, [category]: value });
  };

  const toggleVeggie = (veggie) => {
    const updatedVeggies = selection.veggies.includes(veggie)
      ? selection.veggies.filter((v) => v !== veggie)
      : [...selection.veggies, veggie];
    setSelection({ ...selection, veggies: updatedVeggies });
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handlePayNow = async () => {
    if (!window.Razorpay) {
      alert('Payment gateway not loaded. Please refresh and try again.');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      // 1. Create order on backend → saved to MongoDB
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ selection, amount: 49900 }), // ₹499.00 in paise
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Order creation failed');

      // 2. Open Razorpay checkout
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: 'INR',
        name: 'Pizzeria 🍕',
        description: `Custom Pizza – ${selection.base} base`,
        order_id: data.orderId,
        handler: async function (response) {
          // 3. Verify payment on backend → updates MongoDB order status to 'paid'
          const verifyRes = await fetch('http://localhost:5000/api/orders/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(response),
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
            alert('🎉 Order placed successfully! Your custom pizza is being prepared.');
            navigate('/dashboard');
          } else {
            alert('Payment verification failed: ' + verifyData.message);
          }
        },
        prefill: {
          name: user.name || 'Pizza Lover',
          email: user.email || 'test@example.com',
          contact: '9999999999',
        },
        theme: { color: '#ff6b6b' },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        alert('Payment failed: ' + response.error.description);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="customizer-options">
            {[
              { name: 'Thin Crust', icon: '🍕' },
              { name: 'Hand Tossed', icon: '🍞' },
              { name: 'Cheese Burst', icon: '🧀' },
              { name: 'Pan Pizza', icon: '🍳' },
              { name: 'Cauliflower Crust', icon: '🥦' }
            ].map((item) => (
              <button
                key={item.name}
                className={`custom-option-btn ${selection.base === item.name ? 'selected' : ''}`}
                onClick={() => handleSelect('base', item.name)}
              >
                <span style={{ fontSize: '2rem' }}>{item.icon}</span>
                {item.name}
              </button>
            ))}
          </div>
        );
      case 2:
        return (
          <div className="customizer-options">
            {[
              { name: 'Classic Tomato', icon: '🍅' },
              { name: 'Spicy Marinara', icon: '🌶️' },
              { name: 'BBQ Sauce', icon: '🍯' },
              { name: 'Garlic Parmesan', icon: '🧄' },
              { name: 'Pesto', icon: '🌿' }
            ].map((item) => (
              <button
                key={item.name}
                className={`custom-option-btn ${selection.sauce === item.name ? 'selected' : ''}`}
                onClick={() => handleSelect('sauce', item.name)}
              >
                <span style={{ fontSize: '2rem' }}>{item.icon}</span>
                {item.name}
              </button>
            ))}
          </div>
        );
      case 3:
        return (
          <div className="customizer-options">
            {[
              { name: 'Mozzarella', icon: '🥛' },
              { name: 'Cheddar', icon: '🧀' },
              { name: 'Provolone', icon: '🥯' },
              { name: 'Vegan Cheese', icon: '🌱' },
              { name: 'Parmesan', icon: '🧂' }
            ].map((item) => (
              <button
                key={item.name}
                className={`custom-option-btn ${selection.cheese === item.name ? 'selected' : ''}`}
                onClick={() => handleSelect('cheese', item.name)}
              >
                <span style={{ fontSize: '2rem' }}>{item.icon}</span>
                {item.name}
              </button>
            ))}
          </div>
        );
      case 4:
        return (
          <div className="customizer-options">
            {[
              { name: 'Onions', icon: '🧅' },
              { name: 'Tomatoes', icon: '🍅' },
              { name: 'Capsicum', icon: '🫑' },
              { name: 'Olives', icon: '🫐' },
              { name: 'Jalapenos', icon: '🌶️' },
              { name: 'Mushrooms', icon: '🍄' },
              { name: 'Corn', icon: '🌽' },
              { name: 'Spinach', icon: '🥬' }
            ].map((item) => (
              <button
                key={item.name}
                className={`custom-option-btn ${selection.veggies.includes(item.name) ? 'selected' : ''}`}
                onClick={() => toggleVeggie(item.name)}
              >
                <span style={{ fontSize: '2rem' }}>{item.icon}</span>
                {item.name}
              </button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return '1. Choose your Base (1/4)';
      case 2: return '2. Choose your Sauce (2/4)';
      case 3: return '3. Select a Cheese Type (3/4)';
      case 4: return '4. Add Veggies (4/4)';
      default: return '';
    }
  };

  const isCurrentStepValid = () => {
    if (step === 1 && !selection.base) return false;
    if (step === 2 && !selection.sauce) return false;
    if (step === 3 && !selection.cheese) return false;
    return true; // Veggies are optional
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h1>Pizzeria Builder</h1>
        <button className="btn-logout" onClick={() => navigate('/dashboard')}>Back to Menu</button>
      </nav>

      <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <div className="customizer-progress">
          {[1, 2, 3, 4].map((s) => (
            <div 
              key={s} 
              className={`progress-step ${s <= step ? 'active' : ''} ${s < step ? 'completed' : ''}`}
            >
              {s < step ? '✓' : s}
            </div>
          ))}
          <div className="progress-line">
            <div className="progress-line-fill" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
          </div>
        </div>

        <div className="customizer-step-title">{getStepTitle()}</div>

        {renderStepContent()}

        <div className="customizer-footer">
          {step > 1 ? (
            <button className="btn-secondary" onClick={prevStep}>Back</button>
          ) : <div></div>}

          {step < 4 ? (
            <button 
              className="btn-primary" 
              style={{ width: 'auto', padding: '0.8rem 2rem' }} 
              onClick={nextStep}
              disabled={!isCurrentStepValid()}
            >
              Next Step
            </button>
          ) : (
            <button 
              className="btn-primary" 
              style={{ width: 'auto', padding: '0.8rem 2rem', background: loading ? '#888' : '#ff6b6b' }} 
              onClick={handlePayNow}
              disabled={loading}
            >
              {loading ? 'Processing...' : '💳 Pay & Place Order (₹499)'}
            </button>
          )}
        </div>
      </div>
      
      {/* Summary Section */}
      <div className="glass-panel" style={{ maxWidth: '800px', margin: '2rem auto', padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
        <h3 style={{ marginBottom: '1rem', color: '#ccc' }}>Your Pizza So Far</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {selection.base && <span className="summary-badge base">Base: {selection.base}</span>}
          {selection.sauce && <span className="summary-badge sauce">Sauce: {selection.sauce}</span>}
          {selection.cheese && <span className="summary-badge cheese">Cheese: {selection.cheese}</span>}
          {selection.veggies.map(v => (
            <span key={v} className="summary-badge veggie">{v}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomPizza;
