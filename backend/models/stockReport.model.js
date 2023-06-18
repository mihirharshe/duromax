const mongoose = require('mongoose');
const { Schema } = mongoose;

const materialDataSchema = Schema({
    boqName: String,
    prodName: String,
    colorShade: String,
    labelId: String,
    units: Number
}, { timestamps: true });

const stockReportSchema = Schema({
    customer: String,
    materialData: [materialDataSchema],
    transactionId: String
}, { timestamps: true });


const stockReportModel = mongoose.model('stockReport', stockReportSchema);

module.exports = { stockReportModel};