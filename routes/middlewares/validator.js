const ErrorHandler = require("../utils/errorhander");

const validator = (schema) => async (req, res, next) => {
    try {
        await schema.validateAsync(req.body);
        next()
    } catch (error) {
        next(new ErrorHandler(error.message, 400))
    }
}

module.exports = validator;