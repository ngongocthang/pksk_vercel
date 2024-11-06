const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter user name"],
    },
    email: {
      type: String,
      required: [true, "Please enter user email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter user password"],
    },
    image: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: [true, "Please enter user password"],
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("User", UserSchema);
