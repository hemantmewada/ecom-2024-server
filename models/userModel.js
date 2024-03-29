const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "vendor", "customer"],
    },
    otp: {
      type: Number,
    },
    city: {
      type: String,
    },
    zip: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
