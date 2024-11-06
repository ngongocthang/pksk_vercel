const express = require("express");
const router = express.Router();
const {
  createRole,
  findAllRole
} = require("../controllers/RoleController/index");

// Định nghĩa route
router.post("/create", createRole);
router.get("/find-all", findAllRole);

module.exports = router;
