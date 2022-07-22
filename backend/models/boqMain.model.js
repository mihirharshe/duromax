const mongoose = require('mongoose');
const { Schema } = mongoose;

const boqMainSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    content: [{
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
    }]
})

const boqMainModel = mongoose.model('BoqMain', boqMainSchema);

module.exports = boqMainModel;