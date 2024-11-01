const ApiError = require("../models/ApiError");

// Controller function to save an error
const saveErrorReport = async (req) => {
    try {
        const { credits, tokens, outputTokens, message, requestBody, userId } = req.body;
        const { path, method } = req;

        // Create a new ApiError document
        const newError = new ApiError({
            path,
            method,
            credits,
            tokens,
            outputTokens,
            message,
            requestBody,
            userId,
        });

        // Save the error to the database
        return await newError.save();
    } catch (err) {
        console.error(err);
        return null
    }
};


module.exports = { saveErrorReport };
