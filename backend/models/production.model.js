const mongoose = require('mongoose');
const { Schema } = mongoose;

const batchSchema = Schema({
    batch : Number,
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
        density: Number,
    },
    bkt: Number
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