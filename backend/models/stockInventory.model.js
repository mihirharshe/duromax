const mongoose = require('mongoose');
const { Schema } = mongoose;

const stockInventorySchema = Schema({
    productionId: {
        type: String,
        required: true
    },
    boqId: {
        type: String,
        required: true,
    },
    availableBuckets: [{
        bktId: String,
        totalBktNo: Number,
        totalBktQty: Number 
    }]
}, { timestamps: true });

const stockInventoryBuckets = Schema({
    bktQty: Number,
    boqId: String,
    boqName: String,
    productionId: String,
    prodName: String,
    batchId: String,
    labelId: String,
    colorShade: String,
    sold: {
        type: Boolean,
        required: true,
        default: false
    },
    soldTo: String,
    soldTime: Date,
    customerId: String,
    transactionId: String,
    isRestocked: {
        type: Boolean,
        required: true,
        default: false
    },
    restockDetails: {
        previousCustomerId: String,
        previousSoldTime: Date,
        previousTransactionId: String
    }
}, { timestamps: true });

const stockInventoryBucketsModel = mongoose.model('stockInventoryBuckets', stockInventoryBuckets);
const stockInventoryModel = mongoose.model('stockInventory', stockInventorySchema);

module.exports = { stockInventoryModel, stockInventoryBucketsModel };