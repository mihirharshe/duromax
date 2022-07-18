const express = require('express');
const router = express.Router();
const { getBuckets, addBucket, updateBucket, deleteBucket } = require('../controllers/bucket.controller');


router.get('/', async (req, res) => {
    await getBuckets(req, res);
})

router.post('/', async (req, res) => {
    await addBucket(req, res);
})

router.put('/:id', async (req, res) => {
    await updateBucket(req, res);
})

router.delete('/:id', async (req, res) => {
    await deleteBucket(req,res);
})

module.exports = router;