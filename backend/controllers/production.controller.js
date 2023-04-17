const { productionModel, batchModel, bucketDetailsModel } = require('../models/production.model');
const boqMainModel = require('../models/boqMain.model');
const bucketModel = require("../models/bucket.model");
const { generateUID } = require("../utils/generateUID");
const { saveStockInventory } = require('./stockInventory.controller');
const { stockInventoryBucketsModel } = require('../models/stockInventory.model');
const rawMaterialModel = require('../models/rawMaterial.model');

const getAllProductionInserts = async (req, res) => {
    try {
        const productions = await productionModel.find({});
        res.status(200).json({
            message: 'Successfully retrieved productions',
            productions
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

const getOneProductionInsert = async (req, res) => {
    const { id } = req.params;
    try {
        const production = await productionModel.findById(id);
        res.status(200).json({
            message: 'Successfully retrieved a production',
            production
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

const addProductionInsert = async (req, res) => {
    const { name, boqId, qty, pack_size, desc } = req.body;
    try {
        let boq = await boqMainModel.findById(boqId);
        if (!boq) {
            res.status(400).json({
                message: 'Invalid boqId'
            });
        }

        const production = new productionModel({
            name,
            boqId,
            qty,
            pack_size,
            desc
        });
        await production.save();
        res.status(200).json({
            message: 'Successfully added production',
            production
        });
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
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
        const production = await productionModel.findByIdAndUpdate(id, { $set: { [`batches.${batchIdx}`]: { ...batchDetails, batch: batchIdx + 1 } } });
        // console.log(batch);
        await production.save();
        res.status(200).json({
            message: 'Successfully added batch',
            production
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

const addAllBatches = async (req, res) => {
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
    } catch (err) {
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
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

const getBatch = async (req, res) => {
    const { id, batchNo } = req.params;
    try {
        const batch = await batchModel.findOne({ productionId: id, batch: parseInt(batchNo) });
        if (!batch)
            res.status(404).json({
                message: 'No batch found'
            });
        else
            res.status(200).json({
                message: 'Successfully found batch',
                batch
            });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

const updateBatch = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const { batch, quality, bkt, completed, currentIdx } = req.body;
    try {
        const production = await productionModel.findById(id);
        const batches = production.batches.find(b => b.batch === batch);
        console.log(batches);
        if (quality) {
            batches.quality = quality;
        }
        if (bkt) {
            batches.bkt = bkt;
        }
        if (completed) {
            batches.completed = completed;
        }
        if (currentIdx) {
            batches.currentIdx = currentIdx;
        }
        await production.save();
        res.status(200).json({
            message: 'Successfully updated batch',
            production
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

const addCompletedMaterials = async (req, res) => {
    const { id } = req.params;
    const { materials } = req.body;
    try {
        const production = await productionModel.findById(id);
        let totalUsed = materials.totalQty / 1000;
        await rawMaterialModel.findOneAndUpdate({ name: materials.name }, { $inc: { usedQty: totalUsed, qty: -totalUsed } });
        production.completedMaterials.push(materials);
        // production.completedMaterials = [...production.completedMaterials, ...materials];
        await production.save();
        res.status(200).json({
            message: 'Successfully saved completed materials',
            production
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}


const getCompletedMaterails = async (req, res) => {
    const { id } = req.params;
    try {
        const production = await productionModel.findById(id);
        const materials = production.completedMaterials;
        res.status(200).json({
            message: 'Successfully retrieved completed materials',
            materials
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

const addBucketDetails = async (req, res) => {
    const { id, batchId } = req.params;
    let { bucketDetails } = req.body;
    try {
        // const production = await productionModel.findByIdAndUpdate(id, { $set: { bucketDetails } });
        if (!bucketDetails || bucketDetails.length == 0) throw new Error("Bucket details cannot be empty");
        bucketDetails = bucketDetails.filter((item, index, array) => {
            return array.indexOf(item) == index;
        });
        const production = await productionModel.findById(id);
        const batch = production.batches.find(b => b.batch == batchId);
        let density = batch.quality.density;
        let batchLabelId = generateUID();
        let newLabelDetails = { ...batch.labelDetails, labelId: batchLabelId };
        batch.labelDetails = newLabelDetails;
        let out = [];
        for (let i = 0; i < bucketDetails.length; i++) {
            // const bucket = await bucketModel.findById(bucketDetails[i].bktId, { capacity: 1, _id: 0 });
            // bucketDetails[i].bktLabelDetails.labelId = `${batchLabelId}${bucket.capacity}${String.fromCharCode(65 + i)}`; // appends capacity (5/10) and bucket char (A/B/C) to bktLabel
            // bucketDetails[i].bktLabelDetails.qtyKg = bucketDetails[i].bktQty;
            // bucketDetails[i].bktLabelDetails.qtyL = bucketDetails[i].bktQty / density;
            let bucket = bucketDetails[i];
            let labelId = `${batchLabelId}${bucket.bktQty}${String.fromCharCode(65 + i)}`
            bucket.bktLabelDetails = {
                labelId: labelId, // appends capacity (5/10) and bucket char (A/B/C) to bktLabel
                qtyKg: bucket.bktQty,
                qtyL: bucket.bktQty / density
            }
            for (let j = 0; j < bucket.bktNo; j++) {
                out.push(new stockInventoryBucketsModel({
                    "bktId": bucket.bktId,
                    "bktQty": bucket.bktQty,
                    "batchId": batchLabelId ?? null,
                    "labelId": labelId,
                    "boqName": production.name ?? null
                }));
            }
        }
        batch.bucketDetails = bucketDetails;
        bucketDetails.forEach(async (bucket) => {
            await bucketDetailsModel.findOneAndUpdate(
                { 'bktLabelDetails.labelId': bucket.labelId },
                bucket,
                { upsert: true, new: true }
            );

            await bucketModel.findByIdAndUpdate(bucket.bktId,
                {
                    $inc: { qty: -bucket.bktNo, usedQty: bucket.bktNo }
                }
            );
        });

        ////////////////////

        // let out = [];

        // bucketDetails.forEach(obj => {
        //     for(let i = 0; i<obj.bktNo; i++) {
        //         out.push(new stockInventoryBucketsModel({
        //             "bktId": obj.bktId,
        //             "bktQty": obj.bktQty,
        //             "batchId": batchLabelId ?? null,
        //             "labelId": labelId,
        //             "boqName": production.name ?? null
        //         }));
        //     }
        // });

        await stockInventoryBucketsModel.create(out);


        await saveStockInventory(production.boqId, production._id.toString(), bucketDetails);

        await production.save();

        await batchModel.findOneAndUpdate(
            { productionId: id, batch: batchId },
            {
                batch: batch.batch,
                currentIdx: batch.currentIdx,
                completed: batch.completed,
                quality: batch.quality,
                bucketDetails: batch.bucketDetails,
                labelDetails: newLabelDetails
            },
            { upsert: true, new: true }
        );

        res.status(200).json({
            message: "Successfully added bucket details",
            production
        });
    } catch (err) {
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
    } catch (err) {
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
        // updating for stock inventory
        let prodName = labelDetails.productLabelName ?? "";
        let colorShade = labelDetails.colorShade ?? "";
        await stockInventoryBucketsModel.updateMany({ "batchId": batch.labelDetails.labelId }, { $set: { "prodName": prodName, "colorShade": colorShade } });
        batch.labelDetails = Object.assign(batch.labelDetails, labelDetails); // saving colorShade

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
            bucketDetails: batch.bucketDetails,
            batchNo: batch.bucketDetails[0].bktLabelDetails.labelId.substring(0, 12) ?? null,
            colorShade: labelDetails.colorShade,
            productLabelName: labelDetails.productLabelName
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

const findBucketByLabelId = async (req, res) => {
    const { bktLabelId } = req.params;
    const { soldTo } = req.body;
    if (!soldTo)
        res.status(400).json({
            message: 'soldTo is mandatory'
        });

    try {
        const foundBucket = await bucketDetailsModel.findOne({ 'bktLabelDetails.labelId': bktLabelId }, { __v: 0 });
        if (!foundBucket)
            res.status(404).json({
                message: `No bucket found with the given label ID ${bktLabelId}`
            });
        else {
            foundBucket.saleDetails = {
                sold: true,
                soldTo
            }
            await foundBucket.save();

            res.status(200).json({
                message: `Successfully found a bucket with label ID ${bktLabelId}`,
                batch: foundBucket
            });
        }

    } catch (err) {
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
    getBatch,
    updateBatch,
    addCompletedMaterials,
    getCompletedMaterails,
    addBucketDetails,
    saveLabelDetails,
    findBucketByLabelId,
    _getAllBktLabels
}