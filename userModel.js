const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  emailVerificationEnabled: {
    type: Boolean,
    default: false,
  },
  smsVerificationEnabled: {
    type: Boolean,
    default: false,
  },
  otp: {
    code: Number,
    expirationTime: Date,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
