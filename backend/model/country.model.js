const mongoose = require("mongoose");
const schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;


const CountryShema = new schema(
  {
    country_name: { type: String, default: null },
    icon: { type: String, default: null },
    url: { type: String, default: null },
    code: { type: String, default: null },
    is_active: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
CountryShema.index({ country_name: 1, is_deleted: 1 }, { unique: true });
const CountryModel = mongoose.model("Country", CountryShema);

module.exports = CountryModel;