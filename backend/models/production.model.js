const mongoose = require('mongoose');
const { Schema } = mongoose;

const batchSchema = Schema({
    batch : Number,
    productionId: String,
    currentIdx: { 
        type: Number, 
        default: 0 
    },
    completed: {
        type: Boolean,
        default: false
    },
    quality: {
        hegmen: Number,
        viscosity: Number,
        density: Number,
    },
    bucketDetails: [{
        bktId: String,
        bktNo: Number,
        bktQty: Number
    }],
    labelDetails: {
        labelId: String,
        qtyKg: Number,
        qtyL: Number,
        colorShade: String,
    }
}, { timestamps: true });

const completedSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    qty: {
        type: Number,
        required: true,
    },
    mixTime : {
        type: Number,
        required: true
    },
    batch: {
        type: Number,
        required: true
    },
    totalQty: {
        type: Number,
        required: true
    },
    _id: {
        type: String,
    }
}, { timestamps: true });

const productionSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    qty: {
        type: Number,
        required: true,
    },
    pack_size: {
        type: Number,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    batches: {
        type: [batchSchema],
        required: false
    },
    completedMaterials: {
        type: [completedSchema],
        required: false
    }
}, { timestamps: true });

const batchModel = mongoose.model('batch', batchSchema);
const productionModel = mongoose.model('production', productionSchema);

module.exports = {
    batchModel,
    productionModel
};