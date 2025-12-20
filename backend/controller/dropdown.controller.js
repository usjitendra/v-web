const CountryModel = require('../model/country.model');
const LanguageMode = require('../model/language.model');
const { tryCatchFn } = require('../Utils/tryCatch.utils');
const responseHandler = require('../Utils/responseHandler.utils');
const CategoryModel = require('../model/category.model');


class dropdownController {

  country = tryCatchFn(async (req, res) => {
    const countries = await CountryModel.find({
      is_deleted: false, is_active: true,
    }, {
      country_name: 1, _id: 1
    }).sort({ country_name: 1 });

    return responseHandler.successResponse(
      res, 200, "Countries fetched successfully",
      countries);
  })

  language = tryCatchFn(async (req, res) => {

    const pipeline = [
      { $match: { is_deleted: false, is_active: true } },
      {
        $lookup: {
          from: "countries",
          localField: "countryID",
          foreignField: "_id",
          as: "country"
        }
      },
      { $unwind: "$country" },
      {
        $project: {
          _id: 0,
          languagesId: "$_id",
          language_name: 1,
          icon: 1,
          countryID: 1,
          country_name: "$country.country_name"
        }
      },
      { $sort: { language_name: 1 } }
    ];

    const languages = await LanguageMode.aggregate(pipeline);

    return responseHandler.successResponse(
      res,
      200, "Languages fetched successfully",
      languages);
  })

  category = tryCatchFn(async (req, res) => {
    const categories = await CategoryModel.find({
      is_deleted: false, is_active: true,
    }, {
      category_name: 1, _id: 1
    }).sort({ category_name: 1 });

    return responseHandler.successResponse(
      res, 200, "Categories fetched successfully",
      categories);
  })

}


module.exports = new dropdownController();