const slugify = require("slugify");
const CategoryModel = require("../model/category.model");
const { tryCatchFn } = require("../Utils/tryCatch.utils");
const responseHandler = require("../Utils/responseHandler.utils");
const { uploadToCloudinary, deleteFromCloudinary } = require("../Utils/cloudinaryUpload");
const { console } = require("inspector");

class CategoryController {
  //  add Category
  addCategory = tryCatchFn(async (req, res) => {
    const { category_name, icon, image, order, description, is_active } = req.body;
    //  Validation
    if (!category_name) {
      return responseHandler.errorResponse(
        res,
        400,
        "Category name is required"
      );
    }


    //  Generate slug
    const slug = slugify(category_name, {
      lower: true,
      strict: true
    });

    //  Duplicate check (including soft-deleted)
    const exists = await CategoryModel.findOne({
      slug,
      is_deleted: false
    },

    );
    console.log(">>>>>>>>>>>>>>aagaya", exists)

    if (exists) {
      return responseHandler.errorResponse(
        res,
        409,
        "Category already exists11"
      );
    }

    let imageData = null;


    if (req.file) {
      imageData = await uploadToCloudinary(
        req.file.path,
        "categories"
      );
    }

    //  Create category
    const category = await CategoryModel.create({
      category_name,
      slug,
      icon,
      image: imageData,
      description,
      order,
      is_active,
      created_by: req.user?._id
    });

    // Success response
    return responseHandler.successResponse(
      res,
      201,
      "Category created successfully",
      category
    );
  });

  // update Category
  updateCategory = tryCatchFn(async (req, res) => {

    console.log("update category is");

    const { id } = req.params;
    const {
      category_name,
      icon,
      image,
      description,
      order,
      is_active
    } = req.body;


    console.log("req.body is", req.body);


    // Find category
    const category = await CategoryModel.findById(id);

    if (!category || category.is_deleted) {
      return responseHandler.errorResponse(
        res,
        404,
        "Category not found"
      );
    }

    // Update fields (only if provided)
    if (category_name) {
      category.category_name = category_name;
      category.slug = slugify(category_name, {
        lower: true,
        strict: true
      });
    }

    if (icon !== undefined) category.icon = icon;
    if (image !== undefined) category.image = image;
    if (description !== undefined) category.description = description;
    if (order !== undefined) category.order = order;
    if (is_active !== undefined) category.is_active = is_active;

    category.updated_by = req.user?._id;

    //  Save
    await category.save();

    //  Response
    return responseHandler.successResponse(
      res,
      200,
      "Category updated successfully",
      category
    );
  });

  // get all Category

  getAllCategory = tryCatchFn(async (req, res) => {
    const { page = 1, limit = 10, search, is_active } = req.query

    const query = {
      is_deleted: false
    }

    if (is_active !== undefined) {
      query.is_active = is_active === "true";
    }
    if (search) {
      const escapeRegex = (text) =>
        text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      query.category_name = { $regex: escapeRegex(search), $options: "i" }
    }

    const skip = (page - 1) * limit
    const [categories, total] = await Promise.all([
      CategoryModel.find(query)
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),

      CategoryModel.countDocuments(query)
    ]);

    return responseHandler.successResponse(
      res,
      200,
      "Categories fetched successfully",
      {
        data: categories,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit)
        }
      }
    )

  })

  // delete Category

  deleteCategry = tryCatchFn(async (req, res) => {
    const { id } = req.params;
    const category = await CategoryModel.findById(id)

    if (!category || category.is_deleted) {
      return responseHandler.errorResponse(
        res,
        404,
        "Categery not exist"
      )
    }
    category.is_deleted = true
    await deleteFromCloudinary(category.image?.privateURL)
    await category.save()

    return responseHandler.errorResponse(
      res,
      200,
      "Categery Delete Successfully"
    )
  })
}

module.exports = new CategoryController();
