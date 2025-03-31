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
    const { name, capacity, alertQty } = req.body;
    try {
        const bucket = new bucketModel({
            name,
            qty: 0,
            capacity,
            alertQty,
            initialQty: 0
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
        const { name, qty, capacity, alertQty } = req.body;
        if(name)
            bucket.name = name;
        if(qty)
            bucket.qty = qty;
        if(capacity)
            bucket.capacity = capacity;
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
        const bucket = await bucketModel.findById(id);
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

const getDeficitBuckets = async () => {
    try {
        // const deficitBkts = await bucketModel.find({ $expr: { $lt: ['$qty', '$alertQty'] } });
        const aggPipe = [
            {
                $match: { $expr: { $lt: ['$qty', '$alertQty'] } }
            },
            {
                $project: {
                    name: 1,
                    qty: { $round: ['$qty', 3] },
                    alertQty: 1,
                    _id: 0
                }
            }
        ]
        const deficitBkts = await bucketModel.aggregate(aggPipe);
        return deficitBkts;
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getBuckets,
    getSingleBucket,
    addBucket,
    updateBucket,
    deleteBucket,
    getDeficitBuckets
}