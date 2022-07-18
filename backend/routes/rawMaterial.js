const express = require('express');
const router = express.Router();
const { getRawMaterial, addRawMaterial, updateRawMaterial, deleteRawMaterial } = require('../controllers/rawMaterial.controller');


router.get('/', async (req, res) => {
    await getRawMaterial(req, res);
})

router.post('/', async (req, res) => {
    await addRawMaterial(req, res);
})

router.put('/:id', async (req, res) => {
    await updateRawMaterial(req, res);
})

router.delete('/:id', async (req, res) => {
    await deleteRawMaterial(req,res);
})

module.exports = router;