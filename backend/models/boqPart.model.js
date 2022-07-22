const mongoose = require('mongoose');
const { Schema } = mongoose;

const boqPartSchema = Schema({
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
    }
}, { timestamps: true });

const boqPartModel = mongoose.model('BoqPart', boqPartSchema);

module.exports = boqPartModel;
