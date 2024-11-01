const db = require('../models');
const jwt = require('jsonwebtoken');
const ErrorHandler = require('../utils/errorhander');
const User = db.user;

// route middleware to verify a token
const verifyToken = async (req, res, next) => {
	const token = req.cookies.asrtrhnh;
	const accessToken = req.headers["x-access-token"]


	if (token) {
		jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, function (err, decoded) {
			if (err) {
				console.log(err);
				res.statusMessage = "Token Authentication Failed";
				res.sendStatus(401)
				return
			} else {
				req.user = decoded;
				next();
			}
		});
	} else {
		res.statusMessage = "Token Authentication Failed";
		res.sendStatus(401)
	}
}

const isAdmin = (req, res, next) => {
	User.findById(req.user._id).exec((err, user) => {
		if (err) {
			next(new ErrorHandler("You are not an admin", 403))
			return;
		}
		if (user.accountType === 'admin') {
			next();
		} else {
			next(new ErrorHandler("You are not an admin", 403))
		}
	});
};

const isLoggedIn = (req, res, next) => {
	try {
		const token = req.cookies.asrtrhnh;
		if (token) {
			jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, function (err, decoded) {
				if (err) {
					req.isLoggedIn = false;
				} else {
					req.isLoggedIn = true;
					req.user = decoded;
				}
			});
		} else {
			req.isLoggedIn = false;
		}
		next();
	} catch (err) {
		next(new Error("User is not logged in"))
	}
};



const authJwt = {
	isLoggedIn,
	verifyToken,
	isAdmin,
};
module.exports = authJwt;