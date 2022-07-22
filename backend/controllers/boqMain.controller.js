const boqMainModel = require('../models/boqMain.model');

const getAllBoq = async (req, res) => {
    try {
        const boq = await boqMainModel.find();
        res.status(200).json({
            message: 'Successfully retrieved all BOQs',
            boq
        });
    }
    catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
}

const getOneBoq = async (req, res) => {
    const { id } = req.params
    try {
        const boq = await boqMainModel.findById(id);
        res.status(200).json({
            message: 'Successfully retrieved BOQ',
            boq
        });
    }
    catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
}

const addBoq = async (req, res) => {
    const { name, content } = req.body;
    try {
        const boq = await boqMainModel.create({
            name,
            content
        });
        res.status(200).json({
            message: 'Successfully added BOQ',
            boq
        });
    } 
    catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
}

const updateBoq = async (req, res) => {
    const { name, content } = req.body;
    const { id } = req.params;
    try {
        const boq = await boqMainModel.findByIdAndUpdate(id, {
            name,
            content
        });
        res.status(200).json({
            message: 'Successfully updated boq',
            boq
        });
    }
    catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
}

const deleteBoq = async (req, res) => {
    const { id } = req.params;
    try {
        const boq = await boqMainModel.findByIdAndDelete(id);
        res.status(200).json({
            message: 'Successfully deleted BOQ',
            boq
        });
    }
    catch(err) {
        res.status(404).json({
            message : 'BOQ not found',
            error: err.message
        });
    }
}

module.exports = {
    getAllBoq,
    getOneBoq,
    addBoq,
    updateBoq,
    deleteBoq
}