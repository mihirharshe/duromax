const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reports.controller');

router.get('/batch/:prodId/:batchNo', async (req, res) => {
    await reportController.fetchBatchReportAsync(req, res);
});

module.exports = router;