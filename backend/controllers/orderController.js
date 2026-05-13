const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  try {
    const { selection, amount } = req.body;
    const userId = req.user.id; // Assuming authMiddleware attaches user to req

    const options = {
      amount: amount, // amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    const newOrder = new Order({
      userId,
      selection,
      amount,
      razorpayOrderId: razorpayOrder.id,
      status: 'created',
    });

    await newOrder.save();

    res.status(201).json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
      if (order) {
        order.razorpayPaymentId = razorpay_payment_id;
        order.razorpaySignature = razorpay_signature;
        order.status = 'paid';
        await order.save();
        return res.status(200).json({ message: 'Payment verified successfully' });
      }
    }

    res.status(400).json({ message: 'Invalid signature' });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Error verifying payment' });
  }
};
