const { productionModel, batchModel, bucketDetailsModel } = require('../models/production.model');
const bucketModel = require("../models/bucket.model");
const { generateUID } = require("../utils/generateUID");

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

const addBucketDetails = async(req, res) => {
    const { id, batchId } = req.params;
    let { bucketDetails } = req.body;
    try {
        // const production = await productionModel.findByIdAndUpdate(id, { $set: { bucketDetails } });
        if(!bucketDetails || bucketDetails.length == 0) throw new Error("Bucket details cannot be empty");
        bucketDetails = bucketDetails.filter((item, index, array) => {
            return array.indexOf(item) == index;
        });
        const production = await productionModel.findById(id);
        const batch = production.batches.find(b => b.batch == batchId);
        let density = batch.quality.density;
        let batchLabelId = generateUID();
        console.log(bucketDetails);
        for(let i = 0; i < bucketDetails.length; i++) {
            const bucket = await bucketModel.findById(bucketDetails[i].bktId, { capacity: 1, _id: 0 });
            // bucketDetails[i].bktLabelDetails.labelId = `${batchLabelId}${bucket.capacity}${String.fromCharCode(65 + i)}`; // appends capacity (5/10) and bucket char (A/B/C) to bktLabel
            // bucketDetails[i].bktLabelDetails.qtyKg = bucketDetails[i].bktQty;
            // bucketDetails[i].bktLabelDetails.qtyL = bucketDetails[i].bktQty / density;

            bucketDetails[i].bktLabelDetails = {
                labelId: `${batchLabelId}${bucket.capacity}${String.fromCharCode(65 + i)}`, // appends capacity (5/10) and bucket char (A/B/C) to bktLabel
                qtyKg: bucketDetails[i].bktQty,
                qtyL: bucketDetails[i].bktQty / density
            }
        }
        batch.bucketDetails = bucketDetails;
        bucketDetails.forEach(async (bucket) => {
            await bucketDetailsModel.findByIdAndUpdate(
                { 'bktLabelDetails.labelId': bucket.labelId },
                bucket,
                { upsert: true, new: true }
            );

            await bucketModel.findByIdAndUpdate(bucket.bktId, 
                {
                    $inc: { qty: -bucket.bktNo }
                }
            );
        });

        await production.save();

        await batchModel.findOneAndUpdate(
            { productionId: id, batch: batchId },
            {
                batch: batch.batch,
                currentIdx: batch.currentIdx,
                completed: batch.completed,
                quality: batch.quality,
                bucketDetails: batch.bucketDetails,
                labelDetails: batch.labelDetails
            },
            { upsert: true, new: true }
        );

        res.status(200).json({
            message: "Successfully added bucket details",
            production
        });
    } catch(err) {
        res.status(500).json({
            message: err.message
        })
    }
}

const saveLabelDetails = async (req, res) => { // not in use rn
    const { id, batchId } = req.params;
    const { labelDetails } = req.body;
    try {
        const labelId = generateUID();
        labelDetails.labelId = labelId;
        const production = await productionModel.findById(id);
        const batch = production.batches.find(x => x.batch == batchId);
        batch.labelDetails = labelDetails;
        console.log(batch);
        await production.save();

        const savedBatch = await batchModel.findOneAndUpdate(
            { productionId: id, batch: batchId },
            {
                batch: batch.batch,
                currentIdx: batch.currentIdx,
                completed: batch.completed,
                quality: batch.quality,
                bucketDetails: batch.bucketDetails,
                labelDetails: batch.labelDetails
            },
            { upsert: true, new: true }
        );

        res.status(200).json({
            message: "Successfully saved label details",
            labelDetails: batch.labelDetails
        })
    } catch(err) {
        res.status(500).json({
            message: err.message
        })
    }
}

const _getAllBktLabels = async (req, res) => {
    const { id, batchId } = req.params;
    const { labelDetails } = req.body;
    try {
        const production = await productionModel.findById(id);
        const batch = production.batches.find(x => x.batch == batchId);
        batch.labelDetails = labelDetails; // saving colorShade
        await production.save();
        res.status(200).json({
            bucketDetails: batch.bucketDetails,
            batchNo: batch.bucketDetails[0].bktLabelDetails.labelId.substring(0, 12) ?? null,
            colorShade: labelDetails.colorShade
        });

    } catch(err) {
        res.status(500).json({
            message: err.message
        })
    }
}

const findBatchByLabelId = async (req, res) => {
    const { labelId } = req.body;
    try {
        const foundBatch = await batchModel.findOne({ 'labelDetails.labelId': labelId });
        if(!foundBatch)
            res.status(404).json({
                message: `No batch found with the given label ID ${labelId}`
            });
        else
            res.status(200).json({
                message: `Successfully found a batch with label ID ${labelId}`,
                batch: foundBatch
            });
        
    } catch(err) {
        res.status(500).json({
            message: err.message
        })
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
    getCompletedMaterails,
    addBucketDetails,
    saveLabelDetails,
    findBatchByLabelId,
    _getAllBktLabels
}