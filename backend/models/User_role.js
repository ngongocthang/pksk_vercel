const mongoose = require("mongoose");

const User_roleSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true
    },
  }
);

module.exports = mongoose.model("User_role", User_roleSchema);
