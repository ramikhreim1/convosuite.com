const express = require("express");
const passport = require("passport");
const handleTokens = require("../utils/handleTokens");

const route = express.Router();
route.get(
  "/google",
  (req, res, next) => {
    next();
  },
  passport.authenticate("google", { scope: ["email", "profile"] })
);
// Retrieve user data using the access token received</em>
route.get("/callback", async (req, res, next) => {
  passport.authenticate("google", { session: false }, (error, info) => {
    // console.log(error, info);
    if (error) {
      return res.send(error.message);
    }
    const accessToken = handleTokens(req, res, {
      _id: info._id,
      email: info.email,
      customerId: info.customerId,
      accountType: info.accountType,
      googleUser: true,
    });
    // res.redirect(process.env.DOMAIN + `google/login-success/${accessToken}`)
    // res.status(200).json({msg:"Successfully logged in"})
    if (info.accountType !== "user") res.redirect(process.env.DASHBOARD_URL);
    else res.redirect(process.env.FRONT_END_URL + `tools`);
  })(req, res, next);
});

module.exports = route;
