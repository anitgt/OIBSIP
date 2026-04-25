const express = require('express');
const router = express.Router();
const { getAllPizzas } = require('../controllers/pizzaController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, getAllPizzas);

module.exports = router;
