const CountryModel = require('../model/country.model');
const { tryCatchFn } = require('../utils/tryCatch.utils');
const responseHandler = require('../utils/responseHandler.utils');

class CountryController {
  // Add Country
  addContry = tryCatchFn(async (req, res) => {
    const { country_name, code, is_active } = req.body;
    if (!country_name || !code) {
      return responseHandler.errorResponse(res, 400, "Country name and code are required");
    }
    const existingCountry = await CountryModel.findOne({
      country_name: { $regex: `^${country_name}$`, $options: "i" }
    })
    if (existingCountry) {
      return responseHandler.errorResponse(res, 409, "Country already exists");
    }

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