const express = require('express');
const router = express.Router();
const { getAllProductionInserts, getOneProductionInsert, addProductionInsert, updateProductionInsert, deleteProductionInsert } = require('../controllers/production.controller');

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

router.delete('/:id', async(req, res) => {
    await deleteProductionInsert(req, res);
});

module.exports = router;