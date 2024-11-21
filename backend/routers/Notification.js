const express = require("express");
const router = express.Router();
const {
  createNotification,
  findAllNotification,
  findNotification,
  updateNotification,
  deleteNotification,
  deleteAllNotifications
} = require("../controllers/NotificationController/index");

// Định nghĩa route
router.post("/create", createNotification);
router.get("/find-all", findAllNotification);
router.get("/find/:id", findNotification);
router.put("/update/:id", updateNotification);
router.delete("/delete/:id", deleteNotification);
router.delete('/notification-delete', deleteAllNotifications);

module.exports = router;
