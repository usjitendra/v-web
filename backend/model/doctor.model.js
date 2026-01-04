const mongoose = require("mongoose");
const { ref } = require("process");
const slugify = require("slugify");

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      index: true,
      default: "",
    },

    categoryId: {
      type: ObjectId,
      ref: "Category",
    },
    conteryId: {
      type: ObjectId,
      ref: "Country"
    },
    subCategoryId: [{
      type: ObjectId,
      ref: "SubCategory",
    }],

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
    },

    location: {
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      country: { type: String, default: "" },
      address: { type: String, default: "" },
      zipCode: { type: String, default: "" },
    },

    experience: {
      type: Number,
      min: 0,
      default: 0,
    },

    workAt: {
      type: String,
      trim: true,
      default: "",
    },

    about: {
      type: String,
      trim: true,
      default: "",
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    medicalProblems: [
      {
        type: String,
        trim: true,
      },
    ],


    medicalProcedures: [
      {
        type: String,
        trim: true,
      },
    ],

    workExperience: {
      type: String,
      trim: true,
      default: "",
    },

    educationAndTraining: [
      {
        degree: String,
        institute: String,
        year: String,
      },
    ],

    honoursAndAwards: [
      {
        title: String,
        year: String,

      },
    ],

    youtubeVideo: {
      title: String,
      url: String,

    },

    image: {
      publicURL: String,
      privateURL: String,
      default: {},
    },

    gallery: [
      {
        publicURL: String,
        privateURL: String,

      }
    ],

    is_deleted: {
      type: Boolean,
      default: false,
    },

    is_active: {
      type: Boolean,

    },
  },
  { timestamps: true }
);

doctorSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
  }
  next();
});

doctorSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (update.name) {
    update.slug = slugify(update.name, {
      lower: true,
      strict: true,
    });

    this.setUpdate(update);
  }

  next();
});

module.exports = mongoose.model("Doctor", doctorSchema);
