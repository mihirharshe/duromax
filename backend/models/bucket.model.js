const mongoose = require('mongoose');
const { Schema } = mongoose;

const bucketSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    qty: {
        type: Number,
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    alertQty: {
        type: Number,
        required: true,
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

const bucketModel = mongoose.model('Bucket', bucketSchema);

module.exports = bucketModel;