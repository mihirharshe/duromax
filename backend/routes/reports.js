const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reports.controller');
const stockController = require('../controllers/stockInventory.controller');

router.get('/batch/:prodId/:batchNo', async (req, res) => {
    await reportController.fetchBatchReportAsync(req, res);
});

router.get('/batch', async (req, res) => {
    await reportController.getBatchReport(req, res);
});

router.get('/old-stock-inventory', async (req, res) => {
    await stockController.getStockInventory(req, res);
});

router.get('/inventory-bkts', async (req, res) => {
    await stockController.getNewStockInventory(req, res);
});

router.get('/sold-inventory', async (req, res) => {
    await stockController.getSoldStockInventory(req, res);
});

router.get('/stock-inventory', async (req, res) => {
    await reportController.getActualStockInventory(req, res);
});

router.put('/sell-bkt/:bktId', async (req, res) => {
    await stockController.sellBucket(req, res);
});

router.get('/sales', async (req, res) => {
    await reportController.getSales(req, res);
});

router.get('/raw-materials', async (req, res) => {
    await reportController.getRMReport(req, res);
});

router.get('/raw-materials/:name', async (req, res) => {
    await reportController.getAdjRMReport(req, res);
});

router.get('/buckets', async (req, res) => {
    await reportController.getBktReport(req, res);
});

router.get('/buckets/:id', async (req, res) => {
    await reportController.getAdjBktReport(req, res);
});

router.get('/stock-out', async (req, res) => {
    await reportController.getStockReports(req, res);
});

router.get('/stock-out/:transactionId', async (req, res) => {
    await reportController.getSingleStockReport(req, res);
});

// router.post('/send-mail', async (req, res) => {
//     await reportController.sendRMandBktsEmail(req, res);
// })

module.exports = router;