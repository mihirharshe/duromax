const mongoose = require('mongoose');
const { Schema } = mongoose;

const rawMaterialSchema = Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    qty: {
        type: Number,
        required: true,
        min: 0,
    },
    alertQty: {
        type: Number,
        required: true,
        min: 0,
    },
    initialQty: { // initial + added -> total
        type: Number,
        required: true,
        min: 0
    },
    usedQty: { // used + subtracted -> actual used. then in stock -> total - used
        type: Number,
        default: 0,
        required: true,
        min: 0
    },
    addedQty: {
        type: Number,
        default: 0,
        required: true
    },
    subtractedQty: {
        type: Number,
        default: 0,
        required: true
    }
}, { timestamps: true });

const rawMaterialModel = mongoose.model('rawMaterial', rawMaterialSchema);

module.exports = rawMaterialModel;