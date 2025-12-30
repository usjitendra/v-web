const LanguageModel = require("../model/language.model");
const { tryCatchFn } = require("../Utils/tryCatch.utils");
const responseHandler = require("../Utils/responseHandler.utils");

class LanguageController {

  // Add Language
  addLanguage = tryCatchFn(async (req, res) => {
    const { language_name, code, icon, is_active } = req.body;
    console.log(req.body);
    if (!language_name || !code) {
      return responseHandler.errorResponse(
        res,
        400,
        "Language Code  is required"
      );
    }

    // Name duplicate check
    const existingLanguage = await LanguageModel.findOne({
      language_name: { $regex: `^${language_name}$`, $options: "i" },
      is_deleted: false,
    });

    if (existingLanguage) {
      return responseHandler.errorResponse(
        res,
        409,
        "Language name already exists"
      );
    }

    const newLanguage = await LanguageModel.create({
      code,
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
  //  Get All Languages
  getLanguages = tryCatchFn(async (req, res) => {

    const { page = 1, limit = 10, name } = req.query;
    const filter = {
      is_deleted: false
    };

    if (name) {
      filter.language_name = { $regex: name, $options: "i" };
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [languages, total, totalActiveLanguage, totalLanguages] = await Promise.all([
      LanguageModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      LanguageModel.countDocuments(filter),
      LanguageModel.countDocuments({ is_deleted: false, is_active: true }),
      LanguageModel.countDocuments({ is_deleted: false })
    ]);

    return responseHandler.successResponse(
      res,
      200,
      "Languages fetched successfully",
      {
        languages, total, page: parseInt(page), limit: parseInt(limit),
        languageCount: {
          totalLanguages: totalLanguages,
          activeLanguages: totalActiveLanguage,
          inactiveLanguages: totalLanguages - totalActiveLanguage
        }
      }
    );
  });

  // Get Single Language
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

  //  Update Language
  updateLanguage = tryCatchFn(async (req, res) => {
    const { id } = req.params;
    const { language_name, code, icon, is_active } = req.body;

    const language = await LanguageModel.findById(id);

    if (!language || language.is_Deleted) {
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
    language.code = code ?? language.code;
    language.is_active = is_active ?? language.is_active;

    await language.save();

    return responseHandler.successResponse(
      res,
      200,
      "Language updated successfully",
      language
    );
  });

  // Delete Language
  deleteLanguage = tryCatchFn(async (req, res) => {
    const { id } = req.params;
    const language = await LanguageModel.findByIdAndUpdate(
      id,
      { is_deleted: true },
      { new: true }
    );

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
      "Language deleted successfully"
    );
  });

}

module.exports = new LanguageController();
