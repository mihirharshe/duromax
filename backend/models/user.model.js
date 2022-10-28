const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    // roles: {
    //     User: {
    //         type: Number,
    //         default: 1001
    //     },
    //     Admin: Number,
    //     ProjectManager: Number,
    //     FactoryMain: Number
    // },
    roles: {
        type: [String],
        default: ['User']
    },
    active: {
        type: Boolean,
        default: true
    }
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
        