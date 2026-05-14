const express = require('express');
const router = express.Router();
const { getInventory, updateStock } = require('../controllers/inventoryController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, adminMiddleware, getInventory);
router.put('/:id', authMiddleware, adminMiddleware, updateStock);

module.exports = router;
