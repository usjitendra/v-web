const SubCategoryModel = require("../model/subcategory.model")
const CategoryModel = require("../model/category.model")
const { tryCatchFn } = require("../Utils/tryCatch.utils")
const responseHandler = require("../Utils/responseHandler.utils")
const { Regex } = require("lucide-react")
const { option } = require("framer-motion/client")
const slugify = require("slugify");
const { uploadToCloudinary, deleteFromCloudinary } = require("../Utils/cloudinaryUpload");

class SubCategoryController {

  //add SubCategory
  addSubCategory = tryCatchFn(async (req, res) => {
    const {
      categoryId,
      subcategory_name,
      icon,
      slug,
      description1,
      description2,
      is_active = true
    } = req.body;

    console.log("req.body", req.body);

    if (!subcategory_name || !categoryId) {
      return responseHandler.errorResponse(
        res,
        400,
        "Subcategory name and categoryId are required"
      );
    }
    const category = await CategoryModel.findById(categoryId);

    if (!category || !category.is_active || category.is_deleted) {
      return responseHandler.errorResponse(
        res,
        404,
        "Category not found"
      );
    }

    const existSubCategory = await SubCategoryModel.findOne({
      categoryId: categoryId,
      subcategory_name: { $regex: `^${subcategory_name}$`, $options: "i" },
      is_deleted: false
    });

    if (existSubCategory) {
      return responseHandler.errorResponse(
        res,
        409,
        "SubCategory already exists"
      );
    }

    let imageData = null;

    if (req.file) {
      imageData = await uploadToCloudinary(
        req.file.path,
        "subcategories"
      );

    }

    const subCategory = new SubCategoryModel({
      categoryId: categoryId,
      subcategory_name,
      slug,
      image: imageData,
      icon,
      description1,
      description2,
      is_active
    });

    await subCategory.save();

    return responseHandler.successResponse(
      res,
      201,
      "SubCategory added successfully",
      subCategory
    );
  });

  updateSubcategory = tryCatchFn(async (req, res) => {
    const { id } = req.params;
    const {
      categoryId,
      subcategory_name,
      icon,
      description1,
      description2,
      is_active
    } = req.body;

    const subcategory = await SubCategoryModel.findById(id);

    if (!subcategory || subcategory.is_deleted) {
      return responseHandler.errorResponse(
        res,
        404,
        "Subcategory not found"
      );
    }

    if (categoryId) {
      const category = await CategoryModel.findById(categoryId);
      if (!category || !category.is_active || category.is_deleted) {
        return responseHandler.errorResponse(
          res,
          404,
          "Category not found"
        );
      }
      subcategory.categoryId = categoryId;
    }


    if (req.file) {
      const uploadRes = await uploadToCloudinary(
        req.file.path,
        "subcategories"
      );
      subcategory.image = {
        publicURL: uploadRes.secure_url,
        privateURL: uploadRes.public_id
      };
    }

    if (subcategory_name) subcategory.subcategory_name = subcategory_name;
    if (icon) subcategory.icon = icon;
    if (description1) subcategory.description1 = description1;
    if (description2) subcategory.description2 = description2;
    if (typeof is_active === "boolean") subcategory.is_active = is_active;

    await subcategory.save();

    return responseHandler.successResponse(
      res,
      200,
      "Subcategory updated successfully",
      subcategory
    );
  });

  deleteSubcategory = tryCatchFn(async (req, res) => {
    const { id } = req.params;
    const subcategory = await SubCategoryModel.findById(id);

    if (!subcategory || subcategory.is_deleted) {
      return responseHandler.errorResponse(
        res,
        404,
        "Subcategory not found"
      );
    }
    subcategory.is_deleted = true;
    await subcategory.save();

    return responseHandler.successResponse(
      res,
      200,
      "Subcategory deleted successfully"
    );
  });

  getAllSubcategory = tryCatchFn(async (req, res) => {
    const subcategories = await SubCategoryModel.find({ is_deleted: false });
    return responseHandler.successResponse(
      res,
      200,
      "Subcategories fetched successfully",
      subcategories
    );
  });

  getSubcategoryById = tryCatchFn(async (req, res) => {
    const { id } = req.params;
    const subcategory = await SubCategoryModel.findById(id);

    if (!subcategory || subcategory.is_deleted) {
      return responseHandler.errorResponse(
        res,
        404,
        "Subcategory not found"
      );
    }

    return responseHandler.successResponse(
      res,
      200,
      "Subcategory fetched successfully",
      subcategory
    );
  });

}

module.exports = new SubCategoryController();