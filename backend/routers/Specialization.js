const express = require("express");
const router = express.Router();
const {
  createSpecialization,
  findAllSpecialization,
  findSpecialization,
  updateSpecialization,
  deleteSpecialization
} = require("../controllers/SpecializationController/index");
const upload = require('../helpers/multer-config');


// Định nghĩa route
router.post("/create", upload.single('image'), createSpecialization);
router.get("/find-all", findAllSpecialization);
router.get("/find/:id", findSpecialization);
router.put("/update/:id", upload.single('image'), updateSpecialization);
router.delete("/delete/:id", deleteSpecialization);

module.exports = router;
