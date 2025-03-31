const mongoose = require('mongoose');
const { Schema } = mongoose;

const customerSchema = Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
    },
    contact: {
        type: String,
    },
    email: {
        type: String,
    },
    gstNumber: {
        type: String,
    }
}, { timestamps: true });

const customerModel = mongoose.model('customer', customerSchema);

module.exports = customerModel;