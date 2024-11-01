const db = require("../models");
const User = db.user;
const member = db.member;
const bcrypt = require("bcryptjs");
const express = require("express");
const validator = require("../middlewares/validator");
const { isLoggedIn } = require("../auth/authJwt");
const { resetPasswordSchema, createUserSchema } = require("../utils/schemas");
const sendEmail = require("../utils/sendEmail");
const ErrorHandler = require("../utils/errorhander");

// Preparing the router
let app = express.Router();

// get all users, admins for super admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ accountType: "user" });
    const admins = await User.find({ accountType: "admin" });
    return res.json({ users, admins });
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

// get all users for an admin
const getAllUsersByAdminId = async (req, res, next) => {
  try {
    const id = req.user._id;
    const adminData = await member.find({ admin: id }).populate("userId", { accountType: 1, email: 1 });
    return res.json(adminData);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// add a user for a particular admin
const addUser = async (req, res, next) => {
  try {
    const { email, name, role } = req.body;
    const admin = req.user._id;
    const existingUser = await User.findOne({ email: email });
    console.log(existingUser)
    if (existingUser) return next(new ErrorHandler("User already exist", 409));

    const invitee = await member.create({ email, name, role, admin });
    const adminDetails = await User.findById(admin);
    // invation url to be declared

    const inviteurl = process.env.FRONT_END_URL + "invitee/" + invitee._id;
    res.statusMessage = "Invitation send";
    await sendEmail({
      to: email,
      subject: "Invitation to join chatgp.se!",
      template: "invitationEmail",
      context: {
        name: name,
        owner: adminDetails.fname + " " + adminDetails.lname,
        invitationLink: inviteurl,
        our_contact_information:
          process.env.OUR_CONTACT_INFO_FOR_RESET_PASSWORD,
        our_name: process.env.EMAIL_NAME,
      },
    });
    res.sendStatus(200);
    return;
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

// update a user by a particular admin
// const updateUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select("+admin");
//     if (!user) return res.status(404).json({ err: "No such user found" });
//     if (req.id != user.admin)
//       return res.status(400).json({ err: "Not authorized" });
//     const admin = await User.findById(req.id);
//     const newUsers = admin.users.filter((id) => id != req.params.id);
//     await Promise.all([
//       User.findByIdAndDelete(req.params.id),
//       User.findByIdAndUpdate(req.id, {
//         users: newUsers,
//       }),
//     ]);
//     return res.status(200).json({msg:"user deleted"})
//   } catch (error) {
//     console.error(error);
//   }
// };

// delete a user for a particular admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("+admin");
    if (!user) return next(new ErrorHandler("No such user found", 404));
    if (req.user._id !== user.admin)
      return next(new ErrorHandler("Not authorized", 401));
    const admin = await User.findById(req.user._id);
    const newUsers = admin.users.filter((id) => id !== req.params.id);
    await Promise.all([
      User.findByIdAndDelete(req.params.id),
      User.findByIdAndUpdate(req.user._id, {
        users: newUsers,
      }),
    ]);
    return res.status(200).json({ msg: "user deleted" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// add an admin
const addAdmin = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) return next(new ErrorHandler("User already exists", 409));
    // return res.status(409).json({ msg: "user already exists" });
    await User.create({
      email: req.body.email,
      fname: req.body.fname,
      lname: req.body.lname,
      accountType: "admin",
      password: bcrypt.hashSync(req.body.password, 8),
    });
    return res.status(201).json({ msg: "account creation successful" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// delete an admin, user by superadmin
const deleteAdminUser = async (req, res, next) => {
  try {
    const toDelete = await User.findById(req.params.id).select("+admin");
    if (!toDelete) return next(new ErrorHandler("No such user found", 404));
    if (toDelete.accountType === "user") {
      const admin = await User.findById(toDelete.admin);
      const newUsers = admin.users.filter((id) => id != req.params.id);
      await Promise.all([
        User.findByIdAndDelete(req.params.id),
        User.findByIdAndUpdate(admin._id, {
          users: newUsers,
        }),
      ]);
      return res.status(200).json({ msg: "user deleted" });
    }
    toDelete.users.map(async (id) => {
      await User.findByIdAndDelete(id);
    });
    return res.status(200).json({ msg: "Admin deleted" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// update an admin
const updateAdminUser = async (req, res, next) => {
  try {
    const details = await User.findById(req.params.id);
    await User.findByIdAndUpdate(details, {
      email: req.body.email || details.email,
      fname: req.body.fname || details.fname,
      lname: req.body.lname || details.lname,
      status: req.body.status || details.status,
    });
    return res.status(200).json({ msg: "Updation was successful" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const removeMember = async (req, res, next) => {
  try {

    // Find the member by the ID provided in the request
    const memb = await member.findOne({ _id: req.params.id, admin: req.user._id });

    // Check if the member exists
    if (!memb) {
      return next(new ErrorHandler(`The person you are trying to delete doesn't exist`, 400));
    }

    const admin = await User.findById(req.user._id);

    // Update the admin's users array to exclude the deleted member's ID
    admin.users = admin.users.filter(user => user.toString() !== memb.userId?.toString());
    // Delete the member
    await member.findByIdAndDelete(memb._id);
    await admin.save();

    return res.json({ message: "member deleted" });

  } catch (error) {
    next(error);
  }
};


// view all admins
const getAllAdmins = async (req, res, next) => {
  try {
    const admins = await User.find({ accountType: "admin" }).populate({
      path: "users",
    });
    return res.json(admins);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

const verifyAdmin = (req, res, next) => {
  const user = req.user;
  if (user.accountType === "user")
    return next(new ErrorHandler("you should be an admin", 401));
  next();
};

const verifySuperAdmin = (req, res, next) => {
  const user = req.user;
  if (user.accountType !== "superadmin")
    return next(new ErrorHandler("Not authorized", 401));
  next();
};

const getProfile = async (req, res, next) => {
  try {
    const user = req.user;
    console.log(user._id);
    const userDetails = await User.findById(user._id).populate();
    return res.status(200).json(userDetails);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const verifyParticularAdmin = async (req, res, next) => {
  try {
    const details = await User.findById(req.params.id);
    if (req.user._id !== details.admin)
      return next(new ErrorHandler("Not authorized", 401));
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Update the role of a user
const updateUserRole = async (req, res, next) => {
  try {
    // Find the member by the ID provided in the request
    const memb = await member.findOne({ _id: req.params.id, admin: req.user._id });

    // Check if the member exists
    if (!memb) {
      return next(new ErrorHandler(`The person you are trying to delete doesn't exist`, 400));
    }


    // Ensure the new role is one of the allowed values
    const allowedRoles = ['user', 'admin', 'superadmin'];
    if (!allowedRoles.includes(req.body.accountType))
      throw new ErrorHandler('Invalid role', 400);


    const user = await User.findById(memb.userId);

    user.accountType = req.body.accountType;
    await user.save();
    res.json({ message: "Role changed done" });
  } catch (error) {
    return next(error)
  }
};

const checkLoggedIn = (req, res, next) => {
  // console.log(req.isLoggedIn);
  if (!req.isLoggedIn)
    return next(new ErrorHandler("Not logged in", 401));
  next();
};

app.use("/", isLoggedIn, checkLoggedIn);

// profile
app.get("/profile", getProfile);

// admin privilege
app.delete("/users/remove-a-member/:id", verifyAdmin, removeMember); // create user by admin
app.put("/users/update-user-roles/:id", verifyAdmin, updateUserRole); // create user by admin
app.post("/users/create", verifyAdmin, addUser); // create user by admin
app.delete("/users/id/:id", verifyAdmin, deleteUser); // delete user by admin
app.get("/users/", verifyAdmin, getAllUsersByAdminId); // every user details by admin
app.patch("/users/id/:id", verifyAdmin, verifyParticularAdmin, updateAdminUser); // every user details by admin

// superadmin privilege
app.get("/users/all", verifySuperAdmin, getAllUsers); // user details by superadmin
app.get("/admins/all", verifySuperAdmin, getAllAdmins); // get all admins
app.post("/admins/", verifySuperAdmin, addAdmin); // add an admin
app.put("/admins/id/:id", verifySuperAdmin, updateAdminUser); // update an admin
app.delete("/admins/id/:id", verifySuperAdmin, deleteAdminUser); // delete admin or user by superadmin

module.exports = app;
