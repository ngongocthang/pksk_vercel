const express = require("express");
const router = express.Router();
const {
  createSchedule,
  findAllSchedule,
  findSchedule,
  updateSchedule,
  deleteSchedule
} = require("../controllers/ScheduleController/index");

// Định nghĩa route
router.post("/create", createSchedule);
router.get("/find-all", findAllSchedule);
router.get("/find/:id", findSchedule);
router.put("/update/:id", updateSchedule);
router.delete("/delete/:id", deleteSchedule);

module.exports = router;
