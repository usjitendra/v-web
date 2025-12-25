const express = require("express");
const subcategoryRoute = express.Router();
const SubcategoryController = require("../controller/subcategory.controller");
const { upload } = require("../Utils/cloudinaryUpload");

subcategoryRoute.post(
  "/add",
  upload.single("image"),
  SubcategoryController.addSubCategory
);
subcategoryRoute.get("/list", SubcategoryController.getAllSubcategory);
// subcategoryRoute.get("/:id", SubcategoryController.getSubcategoryById);
subcategoryRoute.put(
  "/:id",
  upload.single("image"),
  SubcategoryController.updateSubcategory
);
subcategoryRoute.delete("/:id", SubcategoryController.deleteSubcategory);

module.exports = subcategoryRoute;