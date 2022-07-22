const mongoose = require('mongoose');
const { Schema } = mongoose;
const boqPartModel = require('./boqPart.model');

const boqMainSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    content: [{
        type: Schema.Types.ObjectId,
        ref: 'BoqPart',
        required: true,
    }]
})

const boqMainModel = mongoose.model('BoqMain', boqMainSchema);

module.exports = boqMainModel;