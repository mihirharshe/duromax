const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockInventory.controller');

router.get('/available-stock/:labelId', async (req, res) => {
    await stockController.getAvailableUnitsByLabelId(req, res);
});

router.post('/', async (req, res) => {
    await stockController.executeStockOut(req, res);
});

module.exports = router;