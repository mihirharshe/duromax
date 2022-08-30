const mongoose = require('mongoose');
const { Schema } = mongoose;

const batchSchema = Schema({
    batchNumber : Number,
    currentIdx: { type: Number, default: 0 },
    completed: Boolean,
    quality: {
        hegmen: Number,
        density: Number,
    },
    bkt: Number
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
    }
}, { timestamps: true });

const productionModel = mongoose.model('production', productionSchema);

module.exports = productionModel;