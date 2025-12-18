const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

// Subcategory Schema
const SubCategorySchema = new mongoose.Schema(
  {
    categoryID: { type: ObjectId, ref: "Category", required: true }, // parent category
    subcategory_name: { type: String, required: true },
    icon: { type: String },
    is_active: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
SubCategorySchema.index({ subcategory_name: 1, is_deleted: 1 }, { unique: true });
const SubCategoryModel = mongoose.model("SubCategory", SubCategorySchema);

// Main Category Schema
const CategorySchema = new mongoose.Schema(
  {
    category_name: { type: String, required: true },
    icon: { type: String },
    is_active: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
CategorySchema.index({ category_name: 1, is_deleted: 1 }, { unique: true });
const CategoryModel = mongoose.model("Category", CategorySchema);

module.exports = {
  CategoryModel,
  SubCategoryModel,
};
