const mongoose = require('mongoose');
const { Schema } = mongoose;

const boqMainSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    batch_size: {
        type: Number,
        required: true,
        min: 0
    },
    content: [{
        name: {
            type: String,
            required: true,
        },
        qty: {
            type: Number,
            required: true,
            min: 0
        },
        mixTime : {
            type: Number,
            required: true,
            min: 0
        }
    }]
}, { timestamps: true });

const boqMainModel = mongoose.model('BoqMain', boqMainSchema);

module.exports = boqMainModel;