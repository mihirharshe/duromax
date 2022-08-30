const productionModel = require('../models/production.model');

const getAllProductionInserts = async (req, res) => {
    try {
        const productions = await productionModel.find({});
        res.status(200).json({
            message: 'Successfully retrieved productions',
            productions
        });
    } catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
}

const getOneProductionInsert = async(req, res) => {
    const { id } = req.params;
    try {
        const production = await productionModel.findById(id);
        res.status(200).json({
            message: 'Successfully retrieved a production',
            production
        });
    } catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
}

const addProductionInsert = async (req, res) => {
    const { name, qty, pack_size, desc } = req.body;
    try {
        const production = new productionModel({
            name,
            qty,
            pack_size,
            desc
        });
        await production.save();
        res.status(200).json({
            message: 'Successfully added production',
            production
        });
    } catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
}

const updateProductionInsert = async (req, res) => {
    const { id } = req.params;
    try {
        const production = await productionModel.findById(id);
        const { name, qty, pack_size, desc } = req.body;
        production.name = name;
        production.qty = qty;
        production.pack_size = pack_size;
        production.desc = desc;
        await production.save();
        res.status(200).json({
            message: 'Successfully updated production',
            production
        });
    } catch(err) {
        res.status(404).json({
            message: 'Production not found',
            error: err.message
        });
    }
}

const deleteProductionInsert = async (req, res) => {
    const { id } = req.params;
    try {
        const production = await productionModel.findById(id);
        await production.remove();
        res.status(200).json({
            message: 'Successfully deleted production',
            production
        });
    } catch(err) {
        res.status(404).json({
            message: 'Production not found',
            error: err.message
        });
    }
}

const addBatch = async (req, res) => {
    const { id } = req.params;
    const batch = req.body;
    try {
        const production = await productionModel.findById(id);
        console.log(batch);
        production.batches.push(batch);
        await production.save();
        res.status(200).json({
            message: 'Successfully added batch',
            production
        });
    } catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
}

const getSingleBatch = async (req, res) => {
    const { id } = req.params;
    try {
        const production = await productionModel.findById(id);
        const batches = production.batches;
        res.status(200).json({
            message: 'Successfully retrieved batches',
            batches
        });
    } catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
}

module.exports = {
    getAllProductionInserts,
    getOneProductionInsert,
    addProductionInsert,
    updateProductionInsert,
    deleteProductionInsert,
    addBatch,
    getSingleBatch
}