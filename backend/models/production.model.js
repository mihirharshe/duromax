const mongoose = require('mongoose');
const { Schema } = mongoose;

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
    }
}, { timestamps: true });

const productionModel = mongoose.model('production', productionSchema);

module.exports = productionModel;