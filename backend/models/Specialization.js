const mongoose = require("mongoose");

const SpecializationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter specialization name"],
    },
    description: {
      type: String,
      required: [true, "Please enter specialization description"],
    }
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Specialization", SpecializationSchema);
