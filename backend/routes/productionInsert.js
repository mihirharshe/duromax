const express = require('express');
const router = express.Router();
const { 
    getAllProductionInserts, 
    getOneProductionInsert, 
    addProductionInsert, 
    updateProductionInsert, 
    deleteProductionInsert,
    addBatch,
    addAllBatches,
    getAllBatches,
    updateBatch,
    getCompletedMaterails,
    addCompletedMaterials, 
    addBucketDetails, 
    saveLabelDetails,
    _getAllBktLabels,
    findBucketByLabelId,
    getBatch,
    getAllLabels,
    getRawMaterialsQtyByBoqId,
    getQualityTestDetails,
    updateProductionStatus,
    getBatchCount} = require('../controllers/production.controller');

router.get('/', async(req, res) => {
    await getAllProductionInserts(req, res);
});

router.get('/:id', async(req, res) => {
    await getOneProductionInsert(req, res);
});

router.post('/add', async(req ,res) => {
    await addProductionInsert(req, res);
});

router.put('/:id', async(req, res) => {
    await updateProductionInsert(req, res);
});

router.put('/status/:id', async (req, res) => {
    await updateProductionStatus(req, res);
})

router.delete('/:id', async(req, res) => {
    await deleteProductionInsert(req, res);
});

router.get('/batch/count/:id', async (req, res) => {
    await getBatchCount(req, res);
});

router.get('/batch/all/:id', async(req, res) => {
    await getAllBatches(req, res);
});

router.get('/batch/:id/:batchNo', async (req, res) => {
    await getBatch(req, res);
})

router.post('/batch/:id', async(req, res) => {
    await addBatch(req, res);
});

router.post('/batch/all/:id', async(req, res) => {
    await addAllBatches(req, res);
});

router.put('/batch/:id', async(req, res) => {
    await updateBatch(req, res);
});

router.get(`/quality-details/:id/:batchId`, async (req, res) => {
    await getQualityTestDetails(req, res);
});

router.get('/completed/:id', async(req, res) => {
    await getCompletedMaterails(req, res);
});

router.post('/completed/:id', async(req, res) => {
    await addCompletedMaterials(req, res);
});

router.put('/add-bkts/:id/:batchId', async(req, res) => {
    await addBucketDetails(req, res);
});

router.post('/generate-label/:id/:batchId', async(req, res) => {
    await saveLabelDetails(req, res);
});

router.post('/bktlabels/:id/:batchId', async(req, res) => {
    await _getAllBktLabels(req, res);
});

router.get('/stock-out/:bktLabelId', async(req, res) => {
    await findBucketByLabelId(req, res);
});

router.get('/labels/:id/:batchId', async (req, res) => {
    await getAllLabels(req, res);
});

router.get('/boqContent/:boqId', async (req, res) => {
    await getRawMaterialsQtyByBoqId(req, res);
});

module.exports = router;