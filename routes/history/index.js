const History = require("../models/history");
const User = require("../models/user");
const express = require("express");
const { isLoggedIn } = require("../auth/authJwt");
const ErrorHandler = require("../utils/errorhander");

// Preparing the router
let app = express.Router();

// find tool by api
const findTool = (api) => {
  const tool = api.split("/")[3];
  //   if (tool == "v2") return "openAI";
  //   if (tool == "dalle") return "dalle";
  return tool;
};

// get history by history id
const getHistoryByHistoryId = async (req, res, next) => {
  try {
    const history = await History.findById(req.params.id).populate({
      path: "user",
      select: "fname email _id admin",
    });
    // console.log(history);
    if (!history) return next(new ErrorHandler("No such history found", 404));
    // const user = await User.findById(history.user);
    // if(!user) return next(new ErrorHandler("User was removed", 404));
    if (history.user._id != req.user._id)
      if (history.user.admin != req.user._id)
        return next(new ErrorHandler("Not authorized", 401));
    // history.api = findTool(history.api);
    // console.log(history);
    return res.status(200).json(history);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// get own history
const getOwnHistory = async (req, res, next) => {
  try {
    const id = req.user._id;
    const histories = await History.find({ user: id }).populate({
      path: "user",
      select: "fname email _id admin",
    });
    const compactHistory = []; // tool, n
    histories.forEach((history) => {
      const data = {
        tool: findTool(history.api),
        n: history.n,
        created: history.created,
      };
      compactHistory.push(data);
    });
    return res.status(200).json(compactHistory);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// get users history
const getUsersHistory = async (req, res, next) => {
  try {
    const admin = await User.findById(req.user._id).select(
      "fname email _id member users"
    );
    if (!admin || !admin.users || !admin.users.length)
      return next(new ErrorHandler("You don't have any users", 404));
    const histories = await History.find({
      user: { $in: admin.users },
    }).populate({
      path: "user",
      select: "fname email _id",
    });

    // calculating compact history
    const compactHistory = []; // tool, n, user
    histories.forEach((history) => {
      const data = {
        tool: findTool(history.api),
        n: history.n,
        user: history.user,
        created: history.created,
      };
      compactHistory.push(data);
    });
    return res.status(200).json(compactHistory);

    // return res.status(200).json({ admin, histories });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// get history by user id
const getHistoryByUserId = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      "fname email _id admin"
    );
    if (!user) return next(new ErrorHandler("No such user found", 404));
    const histories = await History.find({ user: req.params.id });
    // calculating compact history
    const compactHistory = []; // tool, n, user
    histories.forEach((history) => {
      const data = {
        tool: findTool(history.api),
        n: history.n,
        created: history.created,
      };
      compactHistory.push(data);
    });
    return res.status(200).json(compactHistory);
    // return res.status(200).json({ user, histories });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const checkLoggedIn = (req, res, next) => {
  if (!req.isLoggedIn) return next(new ErrorHandler("Not logged in", 401));
  next();
};

app.use("/", isLoggedIn, checkLoggedIn);

// query by history id
app.get("/history/:id", getHistoryByHistoryId);

// query by user
app.get("/me", getOwnHistory);
app.get("/users", getUsersHistory);
app.get("/users/:id", getHistoryByUserId);

module.exports = app;
