const boqMainModel = require('../models/boqMain.model');
const rawMaterialModel = require('../models/rawMaterial.model');

const getAllBoq = async (_, res) => {
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
        if(boq) {
            res.status(200).json({
                message: 'Successfully retrieved BOQ',
                boq
            });
        } else {
            res.status(404).json({
                message: 'BOQ not found'
            });
        }
    }
    catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
}

const getOneBoqName = async (req, res) => {
    const { name } = req.params
    try {
        const boq = await boqMainModel.findOne({ name });
        if(boq) {
            res.status(200).json({
                message: `Successfully retrieved BOQ with name ${name}`,
                boq
            });
        } else {
            res.status(404).json({
                message: `BOQ ${name} not found`
            });
        }
        
    }
    catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
}

const addBoq = async (req, res) => {
    const { name, batch_size, content } = req.body;
    const boqExists = await boqMainModel.find({ name }).count() > 0;
    if(boqExists) {
        res.status(400).json({
            message: 'BOQ already exists'
        });
    }
    else {
        try {
            const boq = await boqMainModel.create({
                name,
                batch_size,
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
}

const updateBoq = async (req, res) => {
    const { name, batch_size, content } = req.body;
    const { id } = req.params;
    const boqExists = await boqMainModel.find({ name }).count() > 0;
    if(boqExists) {
        res.status(400).json({
            message: 'BOQ already exists'
        });
    }
    else {
        try {
            const rs = await boqMainModel.findByIdAndUpdate(id, {
                name,
                batch_size,
                content
            });
            console.log(rs);
            res.status(200).json({
                message: `Successfully updated BOQ: ${id}`,
            });
        }
        catch(err) {
            res.status(500).json({
                message: err.message
            });
        }
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
    getOneBoqName,
    addBoq,
    updateBoq,
    deleteBoq
}