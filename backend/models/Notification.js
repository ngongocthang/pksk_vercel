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
    appointment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    recipientType: {
      type: String,
      enum: ['patient', 'doctor'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Notification", NotificationSchema);
