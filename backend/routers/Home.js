const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  filter,
  getHistoryAppointment
} = require("../controllers/HomeController/index");
const {
  patientCreateAppointment, 
  getCurrentUserAppointments,
  processPrematureCancellation,
  showUpcomingAppointments,
  getAppointmentByStatus,
  countAppointmentDoctorDashboard
} = require("../controllers/AppointmentController/index");
const {profilePatient, updateProfilePatient} = require("../controllers/PatientController/index");
const userMiddleware = require("../middlewares/index");
const {
  getScheduleByDoctor
} = require("../controllers/ScheduleController/index");
const { getCurrentUserNotifications } = require("../controllers/NotificationController/index");

// Định nghĩa route
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/create-appointment", userMiddleware, patientCreateAppointment);
router.get("/profilePatient", userMiddleware, profilePatient);
router.post("/updateProfilePatient", userMiddleware, updateProfilePatient);
router.get("/user-appointment", userMiddleware, getCurrentUserAppointments);
router.delete("/cancel-appointment/:id", processPrematureCancellation);
router.get("/show-upcoming-appointments/:id", showUpcomingAppointments);
router.get("/get-appointments-status/:id", getAppointmentByStatus);
router.get("/get-schedule-doctor/:id", getScheduleByDoctor);
router.get("/filter/:id", filter);
router.get("/notification", userMiddleware, getCurrentUserNotifications);
router.get("/medical-history/:id", userMiddleware, getHistoryAppointment);
router.get("/get-data-doctor-dashboard/:id", countAppointmentDoctorDashboard);

module.exports = router;
