const LanguageModel = require("../model/language.model");
const { tryCatchFn } = require("../Utils/tryCatch.utils");
const responseHandler = require("../Utils/responseHandler.utils");

class LanguageController {

  // ✅ Add Language
  addLanguage = tryCatchFn(async (req, res) => {
    const { language_name, icon, is_active } = req.body;

    if (!language_name) {
      return responseHandler.errorResponse(
        res,
        400,
        "Language name is required"
      );
    }

    const existingLanguage = await LanguageModel.findOne({
      language_name: { $regex: `^${language_name}$`, $options: "i" },
    });

    if (existingLanguage) {
      return responseHandler.errorResponse(
        res,
        409,
        "Language already exists"
      );
    }

    const newLanguage = await LanguageModel.create({
      language_name,
      icon,
      is_active,
    });

    return responseHandler.successResponse(
      res,
      201,
      "Language added successfully",
      newLanguage
    );
  });

  // ✅ Get All Languages
  getLanguages = tryCatchFn(async (req, res) => {
    const languages = await LanguageModel.find().sort({ createdAt: -1 });

    return responseHandler.successResponse(
      res,
      200,
      "Languages fetched successfully",
      languages
    );
  });

  // ✅ Get Single Language
  getLanguageById = tryCatchFn(async (req, res) => {
    const { id } = req.params;

    const language = await LanguageModel.findById(id);

    if (!language) {
      return responseHandler.errorResponse(
        res,
        404,
        "Language not found"
      );
    }

    return responseHandler.successResponse(
      res,
      200,
      "Language fetched successfully",
      language
    );
  });

  // ✅ Update Language
  updateLanguage = tryCatchFn(async (req, res) => {
    const { id } = req.params;
    const { language_name, icon, is_active } = req.body;

    const language = await LanguageModel.findById(id);

    if (!language) {
      return responseHandler.errorResponse(
        res,
        404,
        "Language not found"
      );
    }

    // Name duplicate check
    if (language_name) {
      const exists = await LanguageModel.findOne({
        _id: { $ne: id },
        language_name: { $regex: `^${language_name}$`, $options: "i" },
      });

      if (exists) {
        return responseHandler.errorResponse(
          res,
          409,
          "Language name already exists"
        );
      }
    }

    language.language_name = language_name ?? language.language_name;
    language.icon = icon ?? language.icon;
    language.is_active = is_active ?? language.is_active;

    await language.save();

    return responseHandler.successResponse(
      res,
      200,
      "Language updated successfully",
      language
    );
  });

  // ✅ Delete Language
  deleteLanguage = tryCatchFn(async (req, res) => {
    const { id } = req.params;

    const language = await LanguageModel.findById(id);

    if (!language) {
      return responseHandler.errorResponse(
        res,
        404,
        "Language not found"
      );
    }

    await language.deleteOne();

    return responseHandler.successResponse(
      res,
      200,
      "Language deleted successfully"
    );
  });
}

module.exports = new LanguageController();
