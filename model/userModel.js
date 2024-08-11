const { monthsInQuarter } = require("date-fns");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  role: { type: String, enum: ["admin", "sub-admin", "user"], default: "user" },
  refreshToken: { type: String },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
