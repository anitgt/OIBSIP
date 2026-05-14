const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Inventory = require('../models/Inventory');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  try {
    const { items, amount } = req.body;
    const userId = req.user.id; 

    const options = {
      amount: amount, // amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    const newOrder = new Order({
      userId,
      items,
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

        // Update Inventory Stock based on items
        try {
          for (const item of order.items) {
            if (item.type === 'custom' && item.selection) {
              const { base, sauce, cheese, veggies } = item.selection;
              if (base) await Inventory.findOneAndUpdate({ name: base }, { $inc: { stock: -1 } });
              if (sauce) await Inventory.findOneAndUpdate({ name: sauce }, { $inc: { stock: -1 } });
              if (cheese) await Inventory.findOneAndUpdate({ name: cheese }, { $inc: { stock: -1 } });
              if (veggies && veggies.length > 0) {
                await Inventory.updateMany({ name: { $in: veggies } }, { $inc: { stock: -1 } });
              }
            } else {
              // Standard consumption for regular pizzas
              await Inventory.findOneAndUpdate({ name: 'Thin Crust' }, { $inc: { stock: -1 } });
              await Inventory.findOneAndUpdate({ name: 'Classic Tomato' }, { $inc: { stock: -1 } });
              await Inventory.findOneAndUpdate({ name: 'Mozzarella' }, { $inc: { stock: -1 } });
            }
          }
        } catch (invError) {
          console.error('Inventory update failed:', invError);
        }

        return res.status(200).json({ message: 'Payment verified successfully' });
      }
    }

    res.status(400).json({ message: 'Invalid signature' });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Error verifying payment' });
  }
};
