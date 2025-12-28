const mongoose = require("mongoose");
const slugify = require("slugify");

const { ObjectId } = mongoose.Schema.Types;

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },

    slug: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
    },

    countryId:
    {
      type: ObjectId,
      ref: "Category",
    },
    phone: {
      type: String,
      trim: true,
    },


    address: {
      line1: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      country: { type: String, default: "" },
      pincode: { type: String, default: "" },
    },

    hospitalType: {
      type: String,
      enum: ["clinic", "hospital", "diagnostic"],
      default: "hospital",
    },

    categoryIds: [
      {
        type: ObjectId,
        ref: "Category",
      },
    ],

    numberOfBeds: {
      type: Number,
      default: 0,
      min: 0,
    },

    photo: {
      publicURL: { type: String, default: "" },
      privateURL: { type: String, default: "" },
    },

    gallery: [
      {
        publicURL: { type: String },
        privateURL: { type: String },
      }
    ],

    teamAndSpeciality: {
      type: String,
      default: "",
    },

    infrastructure: {
      type: String,
      default: "",
    },

    youtubeVideos: [
      {
        type: String,
      },
    ],

    hospitalIntro: {
      type: String,
      default: "",
    },

    facilities: {
      type: String,
      default: "",
    },

    is_active: {
      type: Boolean,
      default: true,
    },

    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

/* ---------------- SLUG GENERATION ---------------- */

hospitalSchema.pre("save", function (next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
  }
  next();
});

hospitalSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  const name = update?.name || update?.$set?.name;

  if (name) {
    const newSlug = slugify(name, {
      lower: true,
      strict: true,
    });

    if (update.$set) {
      update.$set.slug = newSlug;
    } else {
      update.slug = newSlug;
    }
  }

  next();
});

module.exports = mongoose.model("Hospital", hospitalSchema);
