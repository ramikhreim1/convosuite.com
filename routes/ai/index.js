
const express = require('express');
const {
	initMiddleware,
	creditCheck,
	contentFilterCheck,
	sendResponse,
	creditPayment,
	saveToHistory,
} = require('./middleware');
const ErrorHandler = require('../utils/errorhander');
const ApiError = require('../models/ApiError');

let app = express.Router()

app.use('/', initMiddleware, creditCheck);
app.use('/', require('./chat_gpt'));
app.use('/v2', require('./chat_gpt_v2'));
app.use('/', require('./dalle'));
app.use('/', require('./summarize'));
app.use('/', require('./code/interpret'));
app.use('/', require('./writing/intro'));
app.use('/', require('./jobad'));
app.use('/', require('./codex'));
app.use('/', require('./blog'));
app.use('/', require('./helloworld'));
app.use('/', require('./example'));
app.use('/', require('./sql'));
app.use('/', require('./emailGenerator'));
app.use('/all/', require("./all"));

app.use(contentFilterCheck);
app.use(creditPayment);
app.use(saveToHistory);

app.use(sendResponse);

app.use(async (err, req, res, next) => {

	if (err.response?.data?.error) {
		const message = err.response?.data?.error.message;
		err = new ErrorHandler(message, 400);
	}
	const { path, method } = req

	try {
		const newError = new ApiError({
			path,
			method,
			message: err.message,
			requestBody: req.body,
			userId: req.user._id,
		});

		// Save the error to the database
		newError.save();
	} catch (error) {

	}

	next(err)
})

module.exports = app