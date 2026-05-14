const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['base', 'sauce', 'cheese', 'veggies', 'meat'] 
  },
  stock: { type: Number, default: 0 },
  unit: { type: String, default: 'pcs' } // e.g., 'pcs', 'kg', 'ltr'
}, { timestamps: true });

module.exports = mongoose.model('Inventory', InventorySchema);
