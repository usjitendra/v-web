const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    category_name: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      unique: true
    },

    icon: String,
    image: String,
    description: String,

    order: {
      type: Number,
      default: 0
    },

    is_active: {
      type: Boolean,
      default: true
    },

    is_deleted: {
      type: Boolean,
      default: false
    },

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

const CategoryModel = mongoose.model("Category", CategorySchema);
module.exports = CategoryModel
