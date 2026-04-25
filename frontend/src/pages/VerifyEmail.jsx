import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const { token } = useParams();
  const [message, setMessage] = useState('Verifying...');
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/verify-email/${token}`);
        setMessage(res.data.message);
        setStatus('success');
      } catch (err) {
        setMessage(err.response?.data?.message || 'Verification failed');
        setStatus('error');
      }
    };
    verify();
  }, [token]);

  return (
    <div className="auth-container">
      <div className="glass-panel" style={{ textAlign: 'center' }}>
        <h1 className="logo">Pizzeria</h1>
        <h2 className="title">Email Verification</h2>
        
        <div style={{ margin: '2rem 0', fontSize: '1.2rem' }} className={status === 'error' ? 'error-message' : 'success-message'}>
          {message}
        </div>
        
        {status !== 'loading' && (
          <Link to="/login" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none', width: 'auto', padding: '0.8rem 2rem' }}>
            Go to Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
