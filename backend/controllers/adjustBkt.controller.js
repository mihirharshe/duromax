const adjustBktModel = require('../models/adjustBkt.model');
const bucketModel = require('../models/bucket.model');

const getRecords = async (req, res) => {
    try {
        const records = await adjustBktModel.find();
        res.status(200).json({
            message: 'Successfully retrieved all records',
            records
        });
    }
    catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
}

const addRecord = async (req, res) => {
    const { name, qtyChange, action, description, id } = req.body;
    try {
        const bkt = await bucketModel.findOne({ name });
        if(action === 'Addition') {
            await bucketModel.findOneAndUpdate({ name }, { $inc: { qty: qtyChange, addedQty: qtyChange } });
        } else if(action === 'Subtraction') {
            if (bkt.qty - qtyChange < 0) {
                throw new Error(`Quantity to be subtracted cannot exceed available qty: ${bkt.qty}`);
            }
            await bucketModel.findOneAndUpdate({ name }, { $inc: { qty: -qtyChange, subtractedQty: qtyChange } });
        }
        const record = await adjustBktModel.create({
            name,
            qtyChange,
            action,
            description,
            bktId: id
        });
        res.status(200).json({
            message: 'Successfully added record',
            record
        });
    }
    catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
}

module.exports = {
    getRecords,
    addRecord
}