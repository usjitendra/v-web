const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;


const LanguageSchema = new Schema(
  {
    language_name: { type: String, required: true, unique: true },
    icon: { type: String },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const LanguageModel = mongoose.model("Language", LanguageSchema);

module.exports = LanguageModel;