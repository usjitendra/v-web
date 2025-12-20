const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const CategorySchema = new mongoose.Schema(
  {
    category_name: {
      type: String,
      default: "",
      trim: true
    },

    slug: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },

    icon: String,
    description: String,
    image: {
      publicURL: String,
      privateURL: String
    },
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
      type: ObjectId,
      ref: "User"
    },

    updated_by: {
      type: ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

const CategoryModel = mongoose.model("Category", CategorySchema);
module.exports = CategoryModel
