const mongoose = require('mongoose');

const apiUsageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ["success", "error"]
    },
    message: {
        type: String,
        required: true,
    },
    requestBody: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
    },
    responseData: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null,
    },
}, { timestamps: true, });

const ApiUsage = mongoose.model('ApiUsage', apiUsageSchema);

module.exports = ApiUsage;
