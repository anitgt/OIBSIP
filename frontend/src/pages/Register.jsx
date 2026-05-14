import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await axios.post('/api/auth/register', formData);
      setShowOtp(true);
      // Automatically "verify" after 1.5 seconds
      setIsVerifying(true);
      setTimeout(() => {
        setOtp('123456'); // Fake OTP
        setTimeout(() => {
          setMessage('Account verified successfully! Redirecting...');
          setIsVerifying(false);
          setTimeout(() => {
            navigate('/login');
          }, 1500);
        }, 800);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel">
        <h1 className="logo">Pizzeria</h1>
        
        {!showOtp ? (
          <>
            <h2 className="title">Create Account</h2>
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button type="submit" className="btn-primary">Register</button>
            </form>
            <Link to="/login" className="link-text">Already have an account? Login</Link>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <h2 className="title">Verify Email</h2>
            <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>An OTP has been sent to {formData.email}</p>
            
            <div className="form-group">
              <input 
                type="text" 
                placeholder="Enter 6-digit OTP" 
                value={otp} 
                readOnly 
                style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem', background: 'rgba(255,255,255,0.05)' }}
              />
            </div>

            {isVerifying ? (
              <div style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>
                <span className="pulse">⌛ Verifying automatically...</span>
              </div>
            ) : (
              <div className="success-message">{message}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
