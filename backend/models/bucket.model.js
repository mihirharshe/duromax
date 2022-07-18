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
    alertQty: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

const bucketModel = mongoose.model('Bucket', bucketSchema);

module.exports = bucketModel;