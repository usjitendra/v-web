const mongoose = require("mongoose");
const slugify = require("slugify");

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const SubCategorySchema = new Schema(
  {
    categoryId: {
      type: ObjectId,
      ref: "Category",
      required: true,
      index: true
    },

    subcategory_name: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      lowercase: true,
      index: true
    },
    image: {
      publicURL: String,
      privateURL: String
    },
    icon: String,
    description1: String,
    description2: String,

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

/* create ke time slug */
SubCategorySchema.pre("save", function (next) {
  if (this.isModified("subcategory_name")) {
    this.slug = slugify(this.subcategory_name, {
      lower: true,
      strict: true
    });
  }
  next();
});

/* update ke time slug */
SubCategorySchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (update.subcategory_name) {
    update.slug = slugify(update.subcategory_name, {
      lower: true,
      strict: true
    });
    this.setUpdate(update);
  }

  next();
});



module.exports = mongoose.model("SubCategory", SubCategorySchema);
