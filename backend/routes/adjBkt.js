const express = require('express');
const router = express.Router();
const { getRecords, addRecord } = require('../controllers/adjustBkt.controller');

router.get('/', async (req, res) => {
    await getRecords(req, res);
});

router.post('/add', async (req, res) => {
    await addRecord(req, res);
});

module.exports = router;