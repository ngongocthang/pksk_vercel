const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Patient", PatientSchema);
