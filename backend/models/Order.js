const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    name: String,
    type: { type: String }, // 'regular' or 'custom'
    price: Number,
    selection: {
      base: String,
      sauce: String,
      cheese: String,
      veggies: [String]
    }
  }],
  amount: { type: Number, required: true }, // amount in paise
  razorpayOrderId: { type: String, required: true },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  status: { 
    type: String, 
    enum: ['created', 'paid', 'failed', 'order received', 'in the kitchen', 'sent to delivery', 'delivered'], 
    default: 'created' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
