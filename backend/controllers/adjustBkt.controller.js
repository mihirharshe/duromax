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
    const { name, qtyChange, action, description } = req.body;
    try {
        if(action === 'Addition') {
            await bucketModel.findOneAndUpdate({ name }, { $inc: { qty: qtyChange } });
        } else if(action === 'Subtraction') {
            await bucketModel.findOneAndUpdate({ name }, { $inc: { qty: -qtyChange } });
        }
        const record = await adjustBktModel.create({
            name,
            qtyChange,
            action,
            description
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