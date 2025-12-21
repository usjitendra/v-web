
const express = require("express");
const router = express.Router();
const CategoryController = require("../controller/category.controller");
const { upload } = require("../Utils/cloudinaryUpload");

router.post("/add", upload.single("image"), CategoryController.addCategory);
router.get("/list", CategoryController.getAllCategory);
// router.get("/:id", CategoryController.getCategoryById);
router.put("/:id",upload.single("image"), CategoryController.updateCategory);
router.delete("/:id", CategoryController.deleteCategry);

module.exports = router;