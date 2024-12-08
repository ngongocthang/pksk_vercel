const express = require("express");
const router = express.Router();
const userMiddleware = require("../middlewares/index");

const {
  createAppointment,
  findAllAppointment,
  findAppointment,
  updateAppointment,
  deleteAppointment,
  getAllAppointmentAdmin,
  deleteAppointmentByStatus
} = require("../controllers/AppointmentController/index");

// Định nghĩa route
router.post("/create", createAppointment);
router.get("/find-all", findAllAppointment);
router.get("/find/:id", findAppointment);
router.put("/update/:id", userMiddleware, updateAppointment);
router.delete("/delete/:id", deleteAppointment);
router.get("/get-all-admin", getAllAppointmentAdmin);
router.delete("/delete-by-status/:id", deleteAppointmentByStatus);

module.exports = router;
