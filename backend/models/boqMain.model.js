const mongoose = require('mongoose');
const { Schema } = mongoose;

const qualityTestLimitSchema = Schema({
    densityRange: {
        from: Number,
        to: Number
    },
    hegmenRange: {
        from: Number,
        to: Number
    }
});

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
    }],
    qualityTestLimits: qualityTestLimitSchema
}, { timestamps: true });

const boqMainModel = mongoose.model('BoqMain', boqMainSchema);

module.exports = boqMainModel;