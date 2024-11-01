const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const memberSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
    maxLength: 100,
  },
  admin: {
    type: ObjectId,
    required: true,
    ref: "user",
  },
  name: {
    type: String,
  },
  role: {
    type: String,
  },
  status: {
    type: String,
    default: "pending",
  },
  userId: {
    type: ObjectId,
    ref: "user",
  },
});

const member = mongoose.model("member", memberSchema);
module.exports = member;
