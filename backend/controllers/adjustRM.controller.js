const adjustRMModel = require('../models/adjustRM.model');
const rawMaterialModel = require('../models/rawMaterial.model');

const getRecords = async (req, res) => {
    try {
        const records = await adjustRMModel.find();
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
            await rawMaterialModel.findOneAndUpdate({ name }, { $inc: { qty: qtyChange } });
        } else if(action === 'Subtraction') {
            await rawMaterialModel.findOneAndUpdate({ name }, { $inc: { qty: -qtyChange } });
        }
        const record = await adjustRMModel.create({
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