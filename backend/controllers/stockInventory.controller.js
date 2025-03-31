const { stockInventoryModel, stockInventoryBucketsModel } = require("../models/stockInventory.model");
const { stockReportModel } = require("../models/stockReport.model");
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

module.exports = { saveStockInventory, getStockInventory, getNewStockInventory, sellBucket, getAvailableUnitsByLabelId, executeStockOut, getSoldStockInventory, restockSealedBucket }