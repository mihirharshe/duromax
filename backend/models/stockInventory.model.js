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

const stockInventoryModel = mongoose.model('stockInventory', stockInventorySchema);

module.exports = { stockInventoryModel };