const mongoose = require("mongoose");
const slugify = require("slugify");

const schema = mongoose.Schema;

const CountrySchema = new schema(
  {
    country_name: { type: String, required: true },
    slug: { type: String, unique: true, lowercase: true },
    icon: { type: String, default: null },
    url: { type: String, default: null },
    code: { type: String, default: null },
    is_active: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

CountrySchema.index({ country_name: 1, is_deleted: 1 }, { unique: true });
CountrySchema.index({ slug: 1, is_deleted: 1 }, { unique: true });

CountrySchema.pre("save", function (next) {
  if (this.isModified("country_name")) {
    this.slug = slugify(this.country_name, {
      lower: true,
      strict: true,
      trim: true,
    });
  }
  next();
});

CountrySchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.country_name) {
    update.slug = slugify(update.country_name, {
      lower: true,
      strict: true,
      trim: true,
    });
    this.setUpdate(update);
  }
  next();
});

const CountryModel = mongoose.model("Country", CountrySchema);
module.exports = CountryModel;
