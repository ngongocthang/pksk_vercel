const express = require("express");
const router = express.Router();
const {
  createSpecialization,
  findAllSpecialization,
  findSpecialization,
  updateSpecialization,
  deleteSpecialization
} = require("../controllers/SpecializationController/index");

// Định nghĩa route
router.post("/create", createSpecialization);
router.get("/find-all", findAllSpecialization);
router.get("/find/:id", findSpecialization);
router.put("/update/:id", updateSpecialization);
router.delete("/delete/:id", deleteSpecialization);

module.exports = router;
