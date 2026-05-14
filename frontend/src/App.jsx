import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import CustomPizza from './pages/CustomPizza';
import Cart from './pages/Cart';
import AdminInventory from './pages/AdminInventory';
import AdminOrders from './pages/AdminOrders';
import MyOrders from './pages/MyOrders';
import { CartProvider } from './context/CartContext';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route
              path="/dashboard"
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            />
            <Route
              path="/custom-pizza"
              element={<ProtectedRoute><CustomPizza /></ProtectedRoute>}
            />
            <Route
              path="/cart"
              element={<ProtectedRoute><Cart /></ProtectedRoute>}
            />
            <Route
              path="/my-orders"
              element={<ProtectedRoute><MyOrders /></ProtectedRoute>}
            />
            <Route
              path="/admin/inventory"
              element={<ProtectedRoute><AdminInventory /></ProtectedRoute>}
            />
            <Route
              path="/admin/orders"
              element={<ProtectedRoute><AdminOrders /></ProtectedRoute>}
            />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;

