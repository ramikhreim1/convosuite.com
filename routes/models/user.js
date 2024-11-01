const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { v4 } = require("uuid");
const { string } = require("../../node_modules/joi/lib/index");

const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
    maxLength: 100,
  },
  fname: { type: String, default: "", maxLength: 100 },
  lname: { type: String, default: "", maxLength: 100 },
  password: { type: String, default: "", maxLength: 100 },
  accountType: { type: String, default: "user" }, // user, admin, superadmin
  users: [{ type: ObjectId, ref: "user" }],
  permissions: { type: [String], default: ["user"] },
  created: { type: Date, default: Date.now },
  admin: { type: ObjectId, select: false },
  status: { type: String },
  credits: {
    type: Number,
    default: 1000,
    integer: true,
    get: (v) => Math.round(v),
    set: (v) => Math.round(v),
  },
  creditsUsed: {
    type: Number,
    default: 0,
    integer: true,
    get: (v) => Math.round(v),
    set: (v) => Math.round(v),
  },
  resetToken: { type: String },
  resetTokenExpiration: { type: Date },
});
UserSchema.index({ resetTokenExpiration: 1 }, { expireAfterSeconds: 0 });

UserSchema.pre("save", function (next) {
  const now = Date.now();
  if (this.resetTokenExpiration && this.resetTokenExpiration < now) {
    this.resetToken = undefined;
    this.resetTokenExpiration = undefined;
  }
  next();
});

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.hash_password);
};

const User = mongoose.model("user", UserSchema);
module.exports = User;
