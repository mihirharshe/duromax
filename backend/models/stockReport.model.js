const mongoose = require('mongoose');
const { Schema } = mongoose;

const materialDataSchema = Schema({
    boqName: String,
    prodName: String,
    colorShade: String,
    labelId: String,
    qty: Number,
    units: Number
}, { timestamps: true });

const stockReportSchema = Schema({
    customerId: String,
    materialData: [materialDataSchema],
    transactionId: String
}, { timestamps: true });


const stockReportModel = mongoose.model('stockReport', stockReportSchema);

module.exports = { stockReportModel};