const mongoose = require('mongoose');
const { Schema } = mongoose;

const bucketDetailsSchema = Schema({
    bktId: String,
    bktNo: Number,
    bktQty: Number,
    bktLabelDetails: {
        labelId: String,
        qtyKg: Number,
        qtyL: Number,
    },
    saleDetails: {
        sold: {
            type: Boolean,
            default: false
        },
        soldTo: String
    }
}, { timestamps: true });

const batchSchema = Schema({
    batch: Number,
    productionId: String,
    currentIdx: {
        type: Number,
        default: 0
    },
    completed: {
        type: Boolean,
        default: false
    },
    stage: {
        type: String,
        enum: ['Screening', 'QualityTesting', 'BucketFilling', 'Labelling', 'Finished'],
        default: 'Screening',
        required: true
    },
    quality: {
        hegmen: Number,
        viscosity: Number,
        density: Number,
    },
    bucketDetails: {
        type: [bucketDetailsSchema],
    },
    labelDetails: {
        labelId: String,
        colorShade: String,
        productLabelName: String
    }
}, { timestamps: true });

const completedSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    qty: {
        type: Number,
        required: true,
    },
    mixTime: {
        type: Number,
        required: true
    },
    batch: {
        type: Number,
        required: true
    },
    totalQty: {
        type: Number,
        required: true
    },
    _id: {
        type: String,
    }
}, { timestamps: true });

const productionSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    boqId: {
        type: String,
        required: true
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
    },
    productLabelName: {
        type: String,
        required: true
    },
    colorShade: {
        type: String,
        required: true
    },
    part: {
        type: String,
        required: true
    },
    batches: {
        type: [batchSchema],
        required: false
    },
    completedMaterials: {
        type: [completedSchema],
        required: false
    },
    status: {
        type: String,
        enum: ['Start', 'Processing', 'Completed'],
        // default: 'Start',
        // required: true
    },
    mrp: {
        type: Number,
        required: false
    }
}, { timestamps: true });

const bucketDetailsModel = mongoose.model('bucketDetails', bucketDetailsSchema);
const batchModel = mongoose.model('batch', batchSchema);
const productionModel = mongoose.model('production', productionSchema);

module.exports = {
    bucketDetailsModel,
    batchModel,
    productionModel
};