const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    new_date: {
      type: Date,
      required: false,
    },
    new_work_shift: {
      type: String,
      enum: ['morning', 'afternoon'],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Notification", NotificationSchema);
