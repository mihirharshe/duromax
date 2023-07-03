const adjustRMModel = require('../models/adjustRM.model');
const bucketModel = require('../models/bucket.model');
const { productionModel, batchModel } = require('../models/production.model');
const rawMaterialModel = require('../models/rawMaterial.model');
const adjustBktModel = require('../models/adjustBkt.model');
const { stockInventoryBucketsModel } = require('../models/stockInventory.model');
const { stockReportModel } = require('../models/stockReport.model');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const { getDeficitRMs } = require('./rawMaterial.controller');
const { getDeficitBuckets } = require('./bucket.controller');
const fs = require('fs');
const { join } = require('path');

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
                            boqObjectId: { $toObjectId: "$boqId" }
                        }
                    },
                    {
                        $lookup: {
                            from: "boqmains",
                            localField: "boqObjectId",
                            foreignField: "_id",
                            as: "batchSize"
                        },
                    },
                    {
                        $addFields: {
                            totalBatches: {
                                $ceil: {
                                    $divide: [
                                        "$qty",
                                        { $arrayElemAt: ["$batchSize.batch_size", 0] }
                                    ]
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            name: 1,
                            totalBatches: 1,
                            qty: 1,
                            batchSize: {
                                $arrayElemAt: ["$batchSize.batch_size", 0]
                            },
                            productLabelName: 1,
                            colorShade: 1,
                            part: 1,
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
                objectIdProdId: 0,
                // "productionDetails.name": 1,
                // "productionDetails.qty": 1,
                // "productionDetails.totalBatches": 1,
                // "productionDetails.batchSize": "$productionDetails.batchSize.batch_size"
            }
        }
    ]
    const report = await batchModel.aggregate(aggregationPipeline);
    return report.length > 0 ? report[0] : null;
}

const fetchBatchReportAsync = async (req, res) => {
    const { prodId, batchNo } = req.params;
    try {
        const reportDetails = await getBatchReportDetails(prodId, parseInt(batchNo));
        if (!reportDetails)
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

// sales report

const getSales = async (req, res) => {
    const { date } = req.query;
    try {
        let formattedDate = new Date(date);
        const results = await stockInventoryBucketsModel.find({
            $expr: {
                $and: [
                    { $eq: [{ $year: "$soldTime" }, formattedDate.getFullYear()] },
                    { $eq: [{ $month: "$soldTime" }, formattedDate.getMonth() + 1] },
                    { $eq: [{ $dayOfMonth: "$soldTime" }, formattedDate.getDate()] }
                ]
            }
        });
        if (!results || results.length == 0) {
            res.status(404).json({
                message: `No sales found for the date ${date}`,
                sales: results
            });
        } else {
            res.status(200).json({
                message: `Sales found for the given date ${date}`,
                sales: results
            })
        }
    } catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
}

// rm report

const getRMReport = async (req, res) => {
    try {
        const rawMaterialsResponse = await rawMaterialModel.aggregate([
            {
                $project: {
                    name: 1,
                    totalQty: { $add: ["$initialQty", "$addedQty"] },
                    usedQty: { $add: ["$usedQty", "$subtractedQty"] }
                }
            },
            {
                $addFields: {
                    stockQty: { $subtract: ["$totalQty", "$usedQty"] }
                }
            }
        ]);

        res.status(200).json({
            message: `Successfully fetched raw material report`,
            rmReport: rawMaterialsResponse
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
}

const getAdjRMReport = async (req, res) => {
    const { name } = req.params;
    try {
        const adjRMDetails = await adjustRMModel.find({ name });
        if (!adjRMDetails)
            res.status(404).json({
                message: `Raw material ${name} adjustments not found`,
                rm: adjRMDetails
            })
        else
            res.status(200).json({
                message: `Adjustments of raw material ${name} found successfully`,
                rm: adjRMDetails
            });
    } catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
}

// bkt report

const getBktReport = async (req, res) => {
    try {
        const bktResponse = await bucketModel.aggregate([
            {
                $project: {
                    name: 1,
                    totalQty: { $add: ["$initialQty", "$addedQty"] },
                    usedQty: { $add: ["$usedQty", "$subtractedQty"] }
                }
            },
            {
                $addFields: {
                    stockQty: { $subtract: ["$totalQty", "$usedQty"] }
                }
            }
        ]);

        res.status(200).json({
            message: `Successfully fetched buckets report`,
            bktReport: bktResponse
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
}

const getAdjBktReport = async (req, res) => {
    const { id } = req.params;
    try {
        const adjBktDetails = await adjustBktModel.find({ bktId: id })
        if (!adjBktDetails || adjBktDetails.length == 0)
            res.status(404).json({
                message: `Bucket with id ${id} adjustments not found`,
                bkt: adjBktDetails
            })
        else
            res.status(200).json({
                message: `Adjustments of bucket with id ${id} found successfully`,
                bkt: adjBktDetails
            });
    } catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
}

// batch report

const getBatchReport = async (req, res) => {
    try {
        // let completedBatches = await batchModel.find({ completed: true }, { productionId: 1, batch: 1 })
        let aggregationPipeline = [
            { $match: { completed: true } },
            {
                $addFields:
                {
                    pid: {
                        $toObjectId: "$productionId",
                    },
                },
            },
            {
                $lookup: {
                    from: "productions",
                    localField: "pid",
                    foreignField: "_id",
                    as: "res",
                },
            },
            {
                $project:
                /**
                 * specifications: The fields to
                 *   include or exclude.
                 */
                {
                    boqName: {
                        $arrayElemAt: ["$res.name", 0],
                    },
                    batch: 1,
                    colorShade: "$labelDetails.colorShade",
                    prodName:
                        "$labelDetails.productLabelName",
                    updatedAt: 1,
                    productionId: 1
                },
            },
        ];
        let batchReports = await batchModel.aggregate(aggregationPipeline);
        res.status(200).json({
            message: 'Successfully fetched batch reports',
            batchReports
        })
    } catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
}

const getStockReports = async (req, res) => {
    try {
        const stockReports = await stockReportModel.find({});
        if (!stockReports)
            throw new Error('No stock reports found');
        
        res.status(200).json({
            stockReports
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
}

const getSingleStockReport = async (req, res) => {
    const { transactionId } = req.params;
    try {
        const report = await stockReportModel.findOne({ transactionId });
        if (!report) {
            throw new Error(`Stock report with transactionId: ${transactionId} not found`);
        }
        res.status(200).json({
            stockReport: report
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
}

const getActualStockInventory = async (req, res) => { // previous stock inventories -> bucket inventories. this is new stock inventory consisting of only boq's along with their available qty
    try {
        let aggregationPipeline = [
            { $match: { sold: false } },
            {
                $group: {
                    _id: "$boqName",
                    totalQty: { $sum: "$bktQty" },
                    updatedAt: { $max: "$updatedAt" }
                }
            }
        ];
        let actualStockInv = await stockInventoryBucketsModel.aggregate(aggregationPipeline);
        res.status(200).json({
            message: `Successfully fetched stock inventory`,
            stockInventory: actualStockInv
        })

    } catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
}

const getEmailTemplateContent = async (template, context) => {
    return new Promise((resolve) => {
        template = template.replace(/(\r\n|\n|\r|\t)/g, "");
        resolve(handlebars.compile(template, { noEscape: true })(context));
    });
}

const sendRMandBktsEmail = async (_req, res) => { // deprecated API (using function in emailUpdates for cron job)

    const deficitRMs = await getDeficitRMs();
    const deficitBkts = await getDeficitBuckets();

    const templateHtml = fs.readFileSync(join(__dirname, '../templates/quantity-alert.html')).toString();

    const data = {
        deficitRawMaterials: deficitRMs,
        deficitBuckets: deficitBkts,
    };

    const htmlBody = await getEmailTemplateContent(templateHtml, data);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_EMAILID,
            pass: process.env.MAIL_PASSWORD
        }
    });
    
    const mailOpts = {
        from: process.env.MAIL_EMAILID,
        to: ['mihir.harshe12@gmail.com'],
        subject: 'Raw Materials and Buckets Quantity Update',
        html: htmlBody
    };
    
    transporter.sendMail(mailOpts, (err, info) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                err
            });
        } else {
            res.status(200).json(info);
        }
    });
}


module.exports = { fetchBatchReportAsync, getSales, getRMReport, getAdjRMReport, getBktReport, getAdjBktReport, getBatchReport, getStockReports, getSingleStockReport, getActualStockInventory, sendRMandBktsEmail }
