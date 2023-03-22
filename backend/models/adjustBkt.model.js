const mongoose = require('mongoose');
const { Schema } = mongoose;

const adjustBktSchema = Schema({
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
    },
    bktId: String
}, { timestamps: true });

const adjustBktModel = mongoose.model('adjustBkt', adjustBktSchema);

module.exports = adjustBktModel;