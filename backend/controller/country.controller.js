const CountryModel = require('../model/country.model');
const { tryCatchFn } = require('../Utils/tryCatch.utils');
const responseHandler = require('../Utils/responseHandler.utils');


const capitalizeFirst = (str = "") => {
  return str
    .toLowerCase()
    .trim()
    .replace(/\b\w/g, char => char.toUpperCase());
};
class CountryController {
  // Add Country
  addContry = tryCatchFn(async (req, res) => {
    let { country_name, code, is_active } = req.body;
    console.log("AA GAYA")
    if (!country_name || !code) {
      return responseHandler.errorResponse(res, 400, "Country name and code are required");
    }
    const existingCountry = await CountryModel.findOne({
      country_name: { $regex: `^${country_name}$`, $options: "i" }
    })
    if (existingCountry) {
      return responseHandler.errorResponse(res, 409, "Country already exists");
    }
    country_name = capitalizeFirst(country_name);
    const newCountry = await CountryModel.create({
      country_name,
      code,
      is_active
    });
    return responseHandler.successResponse(res, 201, "Country added successfully", newCountry);
  })

  // Get All Countries
  getCountries = tryCatchFn(async (req, res) => {
    const { page = 1, limit = 10, name } = req.query;
    const filter = {
      is_Deleted: false
    };

    if (name) {
      filter.country_name = { $regex: name, $options: "i" };
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const Countries = await CountryModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parserInt(limit));

    const total = await CountryModel.countDocuments(filter);

    return responseHandler.successResponse(res, 200, "Countries fetched successfully", {
      data: Countries,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  })

  // Update Country
  updateCountry = tryCatchFn(async (req, res) => {
    const { id } = req.params;
    const { country_name, code, is_active } = req.body;

    const country = await CountryModel.findById(id);
    if (!country) {
      return responseHandler.errorResponse(res, 404, "Country not found");
    }
    if (country_name) country.country_name = country_name;
    if (code) country.code = code;
    if (is_active !== undefined) country.is_active = is_active;

    await country.save();

    return responseHandler.successResponse(res, 200, "Country updated successfully", country);
  })

  // Get Single Country
  getCountryById = tryCatchFn(async (req, res) => {
    const { id } = req.params;

    const country = await CountryModel.findById(id);

    if (!country) {
      return responseHandler.errorResponse(res, 404, "Country not found");
    }

    return responseHandler.successResponse(res, 200, "Country fetched successfully", country);
  })

  // Delete Country
  deleteCountry = tryCatchFn(async (req, res) => {
    const { id } = req.params;

    const country = await CountryModel.findById(id);

    if (!country) {
      return responseHandler.errorResponse(res, 404, "Country not found");
    }
    country.is_deleted = true;
    await country.save();

    return responseHandler.successResponse(res, 200, "Country deleted successfully");
  })
}

module.exports = new CountryController();