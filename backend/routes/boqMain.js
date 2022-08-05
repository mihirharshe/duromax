const express = require('express');
const router = express.Router();
const { getAllBoq, getOneBoq, getOneBoqName, addBoq, updateBoq, deleteBoq } = require('../controllers/boqMain.controller');

router.get('/', async(req, res) => {
    await getAllBoq(req, res);
});

router.get('/:id', async(req, res) => {
    await getOneBoq(req, res);
});

router.get('/name/:name', async(req, res) => {
    await getOneBoqName(req ,res);
});

router.post('/', async(req, res) => {
    await addBoq(req, res);
});

router.put('/:id', async(req, res) => {
    await updateBoq(req, res);
});

router.delete('/:id', async(req, res) => {
    await deleteBoq(req, res);
});

module.exports = router;

