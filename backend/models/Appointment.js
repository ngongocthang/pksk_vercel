const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
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
    work_shift: {
      type: String,
      enum: ['morning', 'afternoon'],
      required: false,
    },
    work_date: {
      type: Date,
      required: false,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default:'pending'
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Appointment", AppointmentSchema);
