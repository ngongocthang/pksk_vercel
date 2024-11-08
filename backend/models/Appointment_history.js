const mongoose = require("mongoose");

const Appointment_historySchema = new mongoose.Schema({
  appointment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  }
});
module.exports = mongoose.model("Appointment_history", Appointment_historySchema);
