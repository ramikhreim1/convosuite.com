const express = require('express');
const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	max: 200 // maximum of 200 requests per windowMs
});

let app = express.Router()

const authJwt = require("./auth/authJwt");

// Webhooks and things
// app.use('/stripe', require('./stripe'))

app.use("/", apiLimiter);

// Signup and Authentication
app.use('/auth', require('./auth'))
app.use('/post', require('./post'))
app.use('/admins', require('./admin'))
app.use('/category', require('./category'))

// Everything after this requires user authentication
app.use('/', authJwt.verifyToken);

// Already signed up user routes
app.use('/user', require('./user'))

app.use('/chat', require('./chat'))
app.get('/tools', (req, res) => {
	res.sendFile(__dirname + "/utils/chatgpt_prompts.json")
})
app.use('/apis_usage', require('./apiUsage'))

// Using AI Platform
app.use('/ai', require('./ai'))

// Using APIs
app.use('/history', require('./history'))

module.exports = app