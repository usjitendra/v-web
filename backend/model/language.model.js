const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;


const LanguageSchema = new Schema(
  {
    countryID: { type: ObjectId, ref: "Country" },
    language_name: { type: String, required: true, },
    icon: { type: String },
    is_active: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

LanguageSchema.index({ language_name: 1, is_deleted: 1 }, { unique: true });

const LanguageModel = mongoose.model("Language", LanguageSchema);

module.exports = LanguageModel;