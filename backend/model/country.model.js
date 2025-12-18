const mongoose = require("mongoose");
const schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;


const CountryShema = new Schema(
  {
    country_name: { type: String, required: true, },
    icon: { type: String },
    is_active: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
CountryShema.index({ country_name: 1, is_deleted: 1 }, { unique: true });
const CountryModel = mongoose.model("Country", CountryShema);

module.exports = CountryModel;