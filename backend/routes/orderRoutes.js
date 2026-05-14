const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, createOrder);
router.post('/verify', authMiddleware, verifyPayment);

// Admin Routes
router.get('/', authMiddleware, adminMiddleware, getAllOrders);
router.put('/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);

module.exports = router;
