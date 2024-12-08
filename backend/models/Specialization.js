const mongoose = require("mongoose");

const SpecializationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    }
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Specialization", SpecializationSchema);
