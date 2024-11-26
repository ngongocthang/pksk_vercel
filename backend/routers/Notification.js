const express = require("express");
const router = express.Router();
const {
  createNotification,
  findAllNotification,
  findNotification,
  updateNotification,
  deleteNotification,
  deleteAllNotifications,
  readNotification,
  getNotificationByDoctorDahsboard
} = require("../controllers/NotificationController/index");

// Định nghĩa route
router.post("/create", createNotification);
router.get("/find-all", findAllNotification);
router.get("/find/:id", findNotification);
router.put("/update/:id", updateNotification);
router.delete("/delete/:id", deleteNotification);
router.delete('/notification-delete', deleteAllNotifications);
router.put("/read/:id", readNotification);
router.get("/get-notification-doctor/:id", getNotificationByDoctorDahsboard);

module.exports = router;
