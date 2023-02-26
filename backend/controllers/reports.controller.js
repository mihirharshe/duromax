const { productionModel, batchModel } = require('../models/production.model');

const getBatchReportDetails = async (prodId, batchNo) => {
    let aggregationPipeline = [
        { $match: { "productionId": prodId, batch: batchNo } },
        {
            $addFields: {
                objectIdProdId: { $toObjectId: "$productionId" }
            }
        },
        {
            $lookup: {
                from: "productions",
                localField: "objectIdProdId",
                foreignField: "_id",
                pipeline: [
                    {
                        $addFields: {
                            totalBatches: { $size: "$batches" }
                        }
                    },
                    {
                        $project: {
                            name: 1,
                            totalBatches: 1,
                            qty: 1,
                            _id: 0
                        }
                    }],
                as: "productionDetails"
            }
        },
        {
            $unwind: "$productionDetails"
        },
        {
            $project: {
                objectIdProdId: 0
            }
        }
    ]
    const report = await batchModel.aggregate(aggregationPipeline);
    return report.length > 0 ? report[0] : null;
}

const fetchBatchReportAsync = async (req, res) => {
    const {prodId, batchNo} = req.params;
    try {
        const reportDetails = await getBatchReportDetails(prodId, parseInt(batchNo));
        if(!reportDetails)
            res.status(404).json({
                message: 'No batch report found'
            });
        else
            res.status(200).json({
                message: 'Batch report successfully found',
                batchReport: reportDetails
            })
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

module.exports = { fetchBatchReportAsync }
