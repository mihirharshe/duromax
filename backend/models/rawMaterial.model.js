const mongoose = require('mongoose');
const { Schema } = mongoose;

const rawMaterialSchema = Schema({
    name: {
        type: String,
        required: true,
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
    }
}, { timestamps: true });

const rawMaterialModel = mongoose.model('rawMaterial', rawMaterialSchema);

module.exports = rawMaterialModel;