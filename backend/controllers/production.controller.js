const { productionModel, batchModel } = require('../models/production.model');

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
    const { batchIdx, batchDetails } = req.body;
    console.log(req.body);
    try {
        const production = await productionModel.findByIdAndUpdate(id, { $set: { [`batches.${batchIdx}`]: {...batchDetails, batch: batchIdx+1 }} });
        // console.log(batch);
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

const addAllBatches = async(req, res) => {
    const { id } = req.params;
    const { batches } = req.body;
    console.log(req.body);
    try {
        // const production = await productionModel.findById(id);
        // console.log(production);
        // production.batches = [...batches];
        // await production.batches.update();
        const production = await productionModel.findByIdAndUpdate(id, { $set: { batches } });
        res.status(200).json({
            message: 'Successfully added all batches',
            production
        });
    } catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
}

const getAllBatches = async (req, res) => {
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

const updateBatch = async(req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const { batch, quality, bkt, completed, currentIdx } = req.body;
    try {
        const production = await productionModel.findById(id);
        const batches = production.batches.find(b => b.batch === batch);
        console.log(batches);
        if(quality) {
            batches.quality = quality;
        }
        if(bkt) {
            batches.bkt = bkt;
        }
        if(completed) {
            batches.completed = completed;
        }
        if(currentIdx) {
            batches.currentIdx = currentIdx;
        }
        await production.save();
        res.status(200).json({
            message: 'Successfully updated batch',
            production
        });
    } catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
}

const addCompletedMaterials = async(req, res) => {
    const { id } = req.params;
    const { materials } = req.body;
    // console.log(materials);
    try {
        const production = await productionModel.findById(id);
        production.completedMaterials.push(materials);
        // production.completedMaterials = [...production.completedMaterials, ...materials];
        await production.save();
        res.status(200).json({
            message: 'Successfully saved completed materials',
            production
        });
    } catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
}


const getCompletedMaterails = async(req, res) => {
    const { id } = req.params;
    try {
        const production = await productionModel.findById(id);
        const materials = production.completedMaterials;
        res.status(200).json({
            message: 'Successfully retrieved completed materials',
            materials
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
    addAllBatches,
    getAllBatches,
    updateBatch,
    addCompletedMaterials,
    getCompletedMaterails
}