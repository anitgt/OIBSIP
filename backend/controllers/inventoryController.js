const Inventory = require('../models/Inventory');

// Seed inventory if empty
const seedInventory = async () => {
  const count = await Inventory.countDocuments();
  if (count === 0) {
    const initialItems = [
      // Bases
      { name: 'Thin Crust', category: 'base', stock: 50 },
      { name: 'Hand Tossed', category: 'base', stock: 50 },
      { name: 'Cheese Burst', category: 'base', stock: 30 },
      // Sauces
      { name: 'Classic Tomato', category: 'sauce', stock: 100 },
      { name: 'Spicy Marinara', category: 'sauce', stock: 80 },
      // Cheeses
      { name: 'Mozzarella', category: 'cheese', stock: 200 },
      { name: 'Cheddar', category: 'cheese', stock: 150 },
      // Veggies
      { name: 'Onions', category: 'veggies', stock: 300 },
      { name: 'Olives', category: 'veggies', stock: 100 },
      // Meats
      { name: 'Pepperoni', category: 'meat', stock: 50 },
      { name: 'Grilled Chicken', category: 'meat', stock: 40 }
    ];
    await Inventory.insertMany(initialItems);
    console.log('Inventory seeded');
  }
};
seedInventory();

exports.getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find({});
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching inventory' });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    const item = await Inventory.findByIdAndUpdate(id, { stock }, { new: true });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Error updating inventory' });
  }
};
