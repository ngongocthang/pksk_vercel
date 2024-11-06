const mongoose = require("mongoose");

const Appointment_historySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    required: true,
    default: "confirmed"
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  appointment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
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
});
module.exports = mongoose.model("Appointment_history", Appointment_historySchema);
