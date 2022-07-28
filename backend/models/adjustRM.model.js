const mongoose = require('mongoose');
const { Schema } = mongoose;

const adjustRMSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    qtyChange: {
        type: Number,
        required: true,
    },
    action: {
        type: String,
        enum: ['Addition', 'Subtraction'],
        required: true,
    },
    description: {
        type: String,
    }
}, { timestamps: true });

const adjustRMModel = mongoose.model('adjustRM', adjustRMSchema);

module.exports = adjustRMModel;