const bucketModel = require('../models/bucket.model');

const getBuckets = async (req, res) => {
    try {
        const buckets = await bucketModel.find({});
        res.status(200).json({
            message: 'Successfully retrieved buckets',
            buckets
        });
    } catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
}

const getSingleBucket = async(req, res) => {
    const { id } = req.params;
    try {
        const bucket = await bucketModel.findById(id);
        res.status(200).json({
            message: `Successfully retrieved bucket with id ${id}`,
            bucket
        })
    } catch(err) {
        res.status(500).json({
            message: err.message
        })
    }
}

const addBucket = async (req, res) => {
    const { name, qty, alertQty } = req.body;
    try {
        const bucket = new bucketModel({
            name,
            qty,
            alertQty
        });
        await bucket.save();
        res.status(200).json({
            message: 'Successfully added a bucket',
            bucket
        });
    } catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
}

const updateBucket = async (req, res) => {
    const { id } = req.params;
    try {
        const bucket = await bucketModel.findById(id);
        const { name, qty, alertQty } = req.body;
        if(name)
            bucket.name = name;
        if(qty)
            bucket.qty = qty;
        if(alertQty)
            bucket.alertQty = alertQty;
        await bucket.save();
        res.status(200).json({
            message: 'Successfully updated a bucket',
            bucket
        });
    } catch(err) {
        res.status(404).json({
            message: 'Bucket not found',
            error: err.message
        });
    }
}

const deleteBucket = async (req, res) => {
    const { id } = req.params;
    try {
        const bucket = await bucket.findById(id);
        await bucket.remove();
        res.status(200).json({
            message: 'Successfully deleted a bucket'
        });
    } catch(err) {
        res.status(404).json({
            message: 'Bucket not found',
            error: err.message
        });
    }
}

module.exports = {
    getBuckets,
    getSingleBucket,
    addBucket,
    updateBucket,
    deleteBucket
}