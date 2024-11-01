const express = require('express');
const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	max: 200 // maximum of 200 requests per windowMs
});

let app = express.Router()

const authJwt = require("./auth/authJwt");

app.use("/", apiLimiter);

// Invitations
app.use('/invitations', require('./invitations'))
// app.use('/apis_usage', require('./apiUsage'))

module.exports = app