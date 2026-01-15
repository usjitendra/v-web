const express = require("express");
const router = express.Router();
const DoctorController = require("../controller/hospital.controller");

const { upload } = require("../Utils/cloudinaryUpload");


router.post("/add", upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "gallery", maxCount: 10 }
]),
  DoctorController.addHospital
);

router.get("/list", DoctorController.getAllHospital);
router.get("/get-all", DoctorController.getAllHospitalList);
router.get("/get-by-slug/:slug", DoctorController.getHospitalBySlug);

router.put(
  "/update/:id",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "gallery", maxCount: 10 }
  ]),
  DoctorController.updateHospital
);

router.delete("/delete/:id", DoctorController.deleteHospital);



module.exports = router;