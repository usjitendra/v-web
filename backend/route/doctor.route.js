const express = require("express");
const router = express.Router();
const DoctorController = require("../controller/doctor.controller");

const { upload } = require("../Utils/cloudinaryUpload");

router.post("/add", upload.fields([
  { name: "image", maxCount: 1 },
  { name: "gallery", maxCount: 10 }
]),
  DoctorController.addDoctor
);
router.get("/get-all", DoctorController.getAllDoctorList);
router.get("/get-by-slug/:slug", DoctorController.getDoctorBySlug);
router.get("/list", DoctorController.getAllDoctors);
router.get("/:id", DoctorController.getDoctorById);


router.put(
  "/update/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 10 }
  ]),
  DoctorController.updateDoctor
);

router.delete("/delete/:id", DoctorController.deleteDoctor);




module.exports = router;