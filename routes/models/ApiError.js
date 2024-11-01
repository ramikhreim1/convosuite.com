const mongoose = require('mongoose');

const apiErrorSchema = new mongoose.Schema({
    path: {
        type: String,
        required: true,
    },
    method: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    requestBody: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null,
    },
}, { timestamps: true });

const ApiError = mongoose.model('ApiError', apiErrorSchema);

module.exports = ApiError;
