const db = require("../models");
const User = db.user;
const member = db.member;
const bcrypt = require("bcryptjs");
const express = require("express");
const handleTokens = require("../utils/handleTokens");
let app = express.Router();
const ObjectId = require("mongodb").ObjectId;
const validator = require("../middlewares/validator");
const { resetPasswordSchema, createUserSchema } = require("../utils/schemas");
const ErrorHandler = require("../utils/errorhander");

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    if (user) throw new ErrorHandler("Failed! Email is already in use!", 409);
    next();
  } catch (error) {
    next(error)
    // res.status(400).json({
    //   message: error.message,
    // });
    // next(error)
    console.error(error);
  }
};
const verifyInvitation = async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.id)) throw new Error("not invited");
    const invitation = await member.findById(req.params.id);
    if (!invitation || invitation.status === 'active')
      throw new ErrorHandler("No invitation was found", 404);
    return res.status(200).json({ email: invitation.email });
  } catch (error) {
    console.error(error);
    // return res.status(400).json({error});
    next(error);
  }
};

const signup = async (req, res, next) => {
  // Check if req.body.password is at least 6 characters long
  if (!req.body.password || req.body.password.length < 6) {
    throw new ErrorHandler("Password must be at least 6 characters long", 400);
  }
  try {
    const invitation = await member.findById(req.params.id);
    if (!invitation)
      // return res.status(404).json({ msg: "No invitation was found" });
      throw new ErrorHandler("No Invitation Found", 404);
    // get admin to update
    const [admin, invitee] = await Promise.all([
      User.findById(invitation.admin),
      User.findOne({ email: invitation.email }),
    ]);
    const admin_id = invitation.admin;
    if (invitee) {
      throw new ErrorHandler("User already exists", 409);
      // return res.status(400).json({ mssg: "User already exists" });
    }

    const [savedUser, updateInvite] = await Promise.all([
      User.create({
        email: invitation.email,
        fname: req.body.fname,
        lname: req.body.lname,
        // customerId: customer.id,
        // referralId: v4(),
        admin: invitation.admin,
        password: bcrypt.hashSync(req.body.password, 8),
        // ...referrerObj
      }),
      member.findByIdAndUpdate(req.params.id, { status: "active" }),
    ]);
    await Promise.all([
      member.findByIdAndUpdate(invitation._id, {
        status: "active",
        userId: savedUser._id,
      }),
      User.findByIdAndUpdate(admin_id, {
        users: [...admin.users, savedUser._id],
      }),
    ]);
    handleTokens(req, res, {
      _id:savedUser._id,
      email:savedUser.email,
      accountType:"user"
    });
    // signin(req, res);
    res.statusMessage = "Email sent";
    res.sendStatus(201);
    return;
  } catch (err) {
    console.error("this is the error", err);
    next(err);
  }
};

app.get("/invite/:id", verifyInvitation);
app.post(
  "/invite/:id",
  validator(createUserSchema),
  checkDuplicateUsernameOrEmail,
  signup
);

module.exports = app;
