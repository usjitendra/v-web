const SubCategoryModel = require("../model/subcategory.model")
const CategoryModel = require("../model/category.model")
const { tryCatchFn } = require("../Utils/tryCatch.utils")
const responseHandler = require("../Utils/responseHandler.utils")
const { Regex } = require("lucide-react")
const { option } = require("framer-motion/client")
const slugify = require("slugify");

class SubCategoryController {

  //add SubCategory
  addSubCategory = tryCatchFn(async (req, res) => {
    const {
      categoryId,
      subcategory_name,
      icon,
      description,
      is_active = true
    } = req.body;

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
      category_id: categoryId,
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

    const subCategory = new SubCategoryModel({
      category_id: categoryId,
      subcategory_name,
      slug,
      icon,
      description,
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

}