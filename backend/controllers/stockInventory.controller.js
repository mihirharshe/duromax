const { stockInventoryModel, stockInventoryBucketsModel } = require("../models/stockInventory.model");
const { stockReportModel } = require("../models/stockReport.model");
const { productionModel } = require("../models/production.model");
const crypto = require('crypto');


const saveStockInventory = async (boqId, productionId, bucketDetails) => {

    let currentStock = await stockInventoryModel.findOne({ boqId });

    if (!currentStock)
        currentStock = new stockInventoryModel({
            productionId,
            boqId,
            availableBuckets: []
        });



    bucketDetails.forEach(async (bucket) => {
        const idx = currentStock.availableBuckets.findIndex(bkt => bkt.bktId == bucket.bktId);
        if (idx !== -1) {
            const availableBkt = currentStock.availableBuckets[idx];
            availableBkt.totalBktNo += bucket.bktNo;
            availableBkt.totalBktQty += bucket.bktQty;
        } else {
            const availableBkt = {
                bktId: bucket.bktId,
                totalBktNo: bucket.bktNo,
                totalBktQty: bucket.bktQty
            };
            currentStock.availableBuckets.push(availableBkt);
        }
    })

    await currentStock.save();
}

const getStockInventory = async (req, res) => {
    try {
        let aggregationPipeline = // [{
            //                 $addFields: {
            //                     boqObjectId: { $toObjectId: "$boqId" }
            //                 }
            //             },
            //             { 
            //                 $lookup: {
            //                     from: "boqmains",
            //                     localField: "boqObjectId",
            //                     foreignField: "_id",
            //                     as: "name",
            //                     pipeline: [
            //                           {
            //                             $project: {
            //                               name: 1, _id: 0
            //                             }
            //                           }
            //                     ]
            //                 } 
            //             },
            //             {
            //                 $project: {
            //                   // boqObjectId: 0,
            //                   name: { $arrayElemAt: ["$name.name", 0] },
            //                   availableBuckets: 1,
            //                   productionId: 1,
            //                   boqId: 1,
            //                   createdAt: 1,
            //                   updatedAt: 1,
            //                 }
            //             },
            //             ]


            [
                {
                    $addFields: {
                        boqObjectId: {
                            $toObjectId: "$boqId"
                        }
                    }
                },
                {
                    $lookup: {
                        from: "boqmains",
                        localField: "boqObjectId",
                        foreignField: "_id",
                        as: "name"
                    }
                },
                {
                    $unwind: "$availableBuckets"
                },
                {
                    $addFields: {
                        "availableBuckets.bktObjectId": { $toObjectId: "$availableBuckets.bktId" }
                    }
                },
                {
                    $lookup: {
                        from: "buckets",
                        localField: "availableBuckets.bktObjectId",
                        foreignField: "_id",
                        as: "bucket",
                    }
                },
                {
                    $project: { "availableBuckets.bktObjectId": 0 }
                },
                {
                    $addFields: {
                        "availableBuckets.bucketName": {
                            $arrayElemAt: [
                                "$bucket.name",
                                0
                            ]
                        }
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        productionId: {
                            $first: "$productionId"
                        },
                        boqId: {
                            $first: "$boqId"
                        },
                        name: {
                            $first: "$name.name"
                        },
                        availableBuckets: {
                            $push: "$availableBuckets"
                        },
                        createdAt: {
                            $first: "$createdAt"
                        },
                        updatedAt: {
                            $first: "$updatedAt"
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        productionId: 1,
                        boqId: 1,
                        name: {
                            $arrayElemAt: [
                                "$name",
                                0
                            ]
                        },
                        availableBuckets: 1,
                        createdAt: 1,
                        updatedAt: 1,
                    }
                }
            ]

        const stocks = await stockInventoryModel.aggregate(aggregationPipeline);
        res.status(200).json({
            message: 'Successfully fetched inventory',
            stocks
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err
        })
    }
}

////////////////////////


const getNewStockInventory = async (req, res) => { // gets unsold entries
    try {
        const readyBuckets = await stockInventoryBucketsModel.find({ sold: false });
        res.status(200).json({
            message: 'Successfully fetched stock buckets',
            inventoryBuckets: readyBuckets
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err
        })
    }
}

const getSoldStockInventory = async (req, res) => {
    try {
        const aggregationPipeline = [
            // Match sold items
            {
                $match: {
                    sold: true
                }
            },
            // Add ObjectId field for customer lookup
            {
                $addFields: {
                    customerObjectId: {
                        $toObjectId: "$customerId"
                    }
                }
            },
            // Lookup customer details
            {
                $lookup: {
                    from: "customers",
                    localField: "customerObjectId",
                    foreignField: "_id",
                    as: "customerDetails"
                }
            },
            // Unwind customer array (converts array to object)
            {
                $unwind: {
                    path: "$customerDetails",
                    preserveNullAndEmptyArrays: true // keeps records even if no customer found
                }
            },
            {
                $sort: {
                    soldTime: -1
                }
            },
            // Project final fields
            {
                $project: {
                    bktQty: 1,
                    boqName: 1,
                    prodName: 1,
                    batchId: 1,
                    labelId: 1,
                    colorShade: 1,
                    sold: 1,
                    soldTime: 1,
                    customer: {
                        name: "$customerDetails.name",
                        address: "$customerDetails.address",
                        contact: "$customerDetails.contact",
                        email: "$customerDetails.email"
                    },
                    transactionId: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ];

        const soldBuckets = await stockInventoryBucketsModel.aggregate(aggregationPipeline);
        res.status(200).json({
            message: 'Successfully fetched sold stock buckets',
            inventoryBuckets: soldBuckets
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err
        });
    }
}

const sellBucket = async (req, res) => {
    const { bktId } = req.params;
    try {
        const bucket = await stockInventoryBucketsModel.findById(bktId);
        if (!bucket)
            res.status(404).json({
                message: 'Bucket not found'
            });
        else {
            bucket.sold = true;
            bucket.soldTime = new Date();
            bucket.save();
        }
        res.status(200).json({
            message: `Bucket with id ${bktId} was successfully sold`,
            updatedBucket: bucket
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err
        })
    }
}

const getAvailableUnitsByLabelId = async (req, res) => {
    const { labelId } = req.params;
    try {
        // let availableUnits = await stockInventoryBucketsModel.find({ labelId: labelId, sold: false }).count();
        // res.status(200).json({
        //     availableUnits,
        //     labelId
        // });
        let availableUnits = await stockInventoryBucketsModel.countDocuments({ labelId: labelId, sold: false });
        let firstDoc = await stockInventoryBucketsModel.findOne({ labelId: labelId, sold: false });
        if (!firstDoc) {
            return res.status(404).json({
                message: `No stock found for Label ID: ${labelId}`
            });
        }

        const { boqName, prodName, colorShade, bktQty } = firstDoc;

        return res.status(200).json({
            prodName,
            boqName,
            colorShade,
            labelId,
            qty: bktQty,
            availableUnits
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err
        })
    }
}

const executeStockOut = async (req, res) => {
    const { scannedStocks, customer, customerId } = req.body;
    try {
        for (const stock of scannedStocks) {
            const { units, labelId } = stock;
            let availableUnits = await stockInventoryBucketsModel.find({ labelId: labelId, sold: false }).count();
            if (units > availableUnits) {
                return res.status(400).json({
                    message: `Units to stock out cannot exceed number of available units: ${availableUnits}`
                });
            }
            let documentsToUpdate = await stockInventoryBucketsModel.find({ labelId: labelId, sold: false }).limit(units);
            for (const doc of documentsToUpdate) {
                doc.sold = true;
                doc.soldTo = customer;
                doc.soldTime = new Date();
                doc.customerId = customerId;
                await doc.save();
            }
        }
        // const labelIds = scannedStocks.map(obj => obj.labelId);

        await stockReportModel.create({
            customerId: customerId,
            materialData: scannedStocks,
            transactionId: crypto.randomUUID()
        })

        return res.status(200).json({
            message: `Successfully performed the stock-out operation`,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: err
        })
    }
}

const restockSealedBucket = async (req, res) => {
    const { labelId } = req.params;
    try {
        // Find the most recently sold bucket with this labelId
        const bucket = await stockInventoryBucketsModel.findOne({ 
            labelId: labelId,
            sold: true 
        }).sort({ soldTime: -1 });

        if (!bucket) {
            return res.status(404).json({
                message: `No sold bucket found with Label ID: ${labelId}`
            });
        }

        bucket.restockDetails = {
            previousCustomerId: bucket.customerId,
            previousSoldTime: bucket.soldTime,
            previousTransactionId: bucket.transactionId
        }
        bucket.isRestocked = true;
        bucket.sold = false;
        bucket.soldTime = null;
        bucket.soldTo = null;
        bucket.customerId = null;
        bucket.transactionId = null;
        
        await bucket.save();

        res.status(200).json({
            message: `Bucket with Label ID ${labelId} was successfully restocked`,
            updatedBucket: bucket
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err
        });
    }
}

const restockUnsealedBucket = async (req, res) => {
    const { labelId, quantity } = req.body;
    // Moved require here to break circular dependency
    const { createRestockProduction } = require("./production.controller"); 

    try {
        if (!labelId || quantity === undefined || quantity === null || quantity <= 0) {
            return res.status(400).json({ message: 'Label ID and a valid positive quantity are required.' });
        }

        // Find the most recently sold bucket with this labelId to validate against
        const originalBucket = await stockInventoryBucketsModel.findOne({
            labelId: labelId,
            sold: true
        }).sort({ soldTime: -1 }).lean(); // Use lean for potentially faster read if we don't modify directly

        if (!originalBucket) {
            return res.status(404).json({
                message: `No previously sold bucket found with Label ID: ${labelId} to restock against.`
            });
        }
        
        // // Check if it's already marked as restocked
        // if (originalBucket.isRestocked) {
        //      return res.status(400).json({
        //          message: `Bucket with Label ID ${labelId} has already been restocked or is pending restock.`
        //      });
        // }

        // Validate the requested restock quantity against the original bucket's quantity
        if (quantity > originalBucket.bktQty) {
            return res.status(400).json({
                message: `Restock quantity (${quantity}kg) cannot exceed the original bucket quantity (${originalBucket.bktQty}kg).`
            });
        }
        // Fetch original production details needed for the new one
        // Since productionId is now reliably stored in stockInventoryBuckets, we can use it directly
        const originalProdReference = await productionModel.findById(
            originalBucket.productionId
        ).select('desc part mrp pack_size').lean();

        if (!originalProdReference) {
            console.error(`Could not find reference production details for BoQ ID: ${originalBucket.boqId} and Product Name: ${originalBucket.prodName}`);
            // Don't mark as restocked if we can't proceed
            return res.status(500).json({ message: 'Could not find original production details necessary for restock.' });
        }

        // Mark the original bucket as restocked (but it remains sold=true)
        // We need to update the actual document, not the lean object
        await stockInventoryBucketsModel.updateOne({ _id: originalBucket._id }, {
            $set: {
                isRestocked: true,
                restockDetails: {
                    previousCustomerId: originalBucket.customerId,
                    previousSoldTime: originalBucket.soldTime,
                    previousTransactionId: originalBucket.transactionId,
                    restockType: 'unsealed', // Mark the type
                    restockedQuantity: quantity // Record the quantity being restocked
                }
            }
        });

        // Trigger the new production process
        const newProductionData = {
            boqId: originalBucket.boqId,
            name: originalBucket.boqName, // Use boqName from bucket which seems to be the main product name
            qty: quantity,
            pack_size: originalProdReference.pack_size, // Use pack_size from reference production
            desc: originalProdReference.desc,
            productLabelName: originalBucket.prodName, // Use prodName from bucket
            colorShade: originalBucket.colorShade,
            part: originalProdReference.part,
            originalProductionId: originalBucket.productionId, // Pass if available, otherwise null/undefined
            mrp: originalProdReference.mrp
        };

        const newProduction = await createRestockProduction(newProductionData);

        res.status(200).json({
            message: `Unsealed restock process initiated for Label ID ${labelId} with quantity ${quantity}kg. New Production ID: ${newProduction._id}`,
            originalBucketId: originalBucket._id,
            newProductionId: newProduction._id
        });

    } catch (err) {
        console.error("Error in restockUnsealedBucket:", err);
        // If createRestockProduction failed, we should ideally revert the isRestocked flag on the original bucket
        // This requires more complex transaction logic or cleanup steps.
        // For now, just return the error.
        res.status(500).json({
            message: err.message || 'An error occurred during the unsealed restock process.'
        });
    }
};

module.exports = { saveStockInventory, getStockInventory, getNewStockInventory, sellBucket, getAvailableUnitsByLabelId, executeStockOut, getSoldStockInventory, restockSealedBucket, restockUnsealedBucket }