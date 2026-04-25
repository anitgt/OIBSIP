const Pizza = require('../models/Pizza');

// Seed some initial pizzas if empty
const seedPizzas = async () => {
  const count = await Pizza.countDocuments();
  if (count === 0) {
    const pizzas = [
      {
        name: 'Margherita',
        description: 'Classic cheese and tomato sauce',
        price: 9.99,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=60',
        category: 'Veg',
      },
      {
        name: 'Pepperoni',
        description: 'Spicy pepperoni with mozzarella',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=500&q=60',
        category: 'Non-Veg',
      },
      {
        name: 'Veggie Supreme',
        description: 'Loaded with bell peppers, onions, and olives',
        price: 11.99,
        image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=500&q=60',
        category: 'Veg',
      },
      {
        name: 'BBQ Chicken',
        description: 'Grilled chicken with BBQ sauce',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=60',
        category: 'Non-Veg',
      },
      {
        name: 'Hawaiian',
        description: 'Ham and pineapple on a cheesy base',
        price: 13.99,
        image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=500&q=60',
        category: 'Non-Veg',
      },
      {
        name: 'Mushroom Truffle',
        description: 'Earthy mushrooms with a drizzle of truffle oil',
        price: 15.99,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=60',
        category: 'Veg',
      }
    ];
    await Pizza.insertMany(pizzas);
    console.log('Seeded pizzas to DB');
  }
};

// Call the seed function
seedPizzas();

exports.getAllPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.find({});
    res.json(pizzas);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};
