const rawMaterialModel = require('../models/rawMaterial.model');

const getRawMaterial = async (req, res) => {
    try {
        const rawMaterials = await rawMaterialModel.find({});
        res.status(200).json({
            message: 'Successfully retrieved raw materials',
            rawMaterials
        });
    } catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
}

const addRawMaterial = async (req, res) => {
    const { name, qty, alertQty } = req.body;
    try {
        const rawMaterial = new rawMaterialModel({
            name,
            qty,
            alertQty,
            initialQty: qty
        });
        await rawMaterial.save();
        res.status(200).json({
            message: 'Successfully added raw material',
            rawMaterial: rawMaterial
        });
    } catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
}

const updateRawMaterial = async (req, res) => {
    const { id } = req.params;
    try {
        const rawMaterial = await rawMaterialModel.findById(id);
        const { name, qty, alertQty } = req.body;
        rawMaterial.name = name;
        rawMaterial.qty = qty;
        rawMaterial.alertQty = alertQty;
        await rawMaterial.save();
        res.status(200).json({
            message: 'Successfully updated raw material',
            rawMaterial
        });
    } catch(err) {
        res.status(404).json({
            message: 'Raw material not found',
            error: err.message
        });
    }
}

const deleteRawMaterial = async (req, res) => {
    const { id } = req.params;
    try {
        const rawMaterial = await rawMaterialModel.findById(id);
        await rawMaterial.remove();
        res.status(200).json({
            message: 'Successfully deleted raw material'
        });
    } catch(err) {
        res.status(404).json({
            message: 'Raw material not found',
            error: err.message
        });
    }
}

module.exports = {
    getRawMaterial,
    addRawMaterial,
    updateRawMaterial,
    deleteRawMaterial
}