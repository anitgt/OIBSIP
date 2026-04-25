const mongoose = require('mongoose');

const pizzaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true, enum: ['Veg', 'Non-Veg'] },
});

module.exports = mongoose.model('Pizza', pizzaSchema);
