const { stockInventoryModel, stockInventoryBucketsModel } = require("../models/stockInventory.model")


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
        console.log(stocks);
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


const getNewStockInventory = async (req, res) => {
    try {
        const readyBuckets = await stockInventoryBucketsModel.find({});
        res.status(200).json({
            message: 'Successfully fetched stock buckets',
            inventoryBuckets: readyBuckets
        });
    } catch(err) {
        console.log(err);
    }
}

const sellBucket = async (req, res) => {
    const { bktId } = req.params;
    try {
        const bucket = await stockInventoryBucketsModel.findById(bktId);
        if(!bucket)
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
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: err
        })
    }
}

module.exports = { saveStockInventory, getStockInventory, getNewStockInventory, sellBucket }