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
    let { country_name, code, url, is_active } = req.body;

    if (!country_name || !code || !url) {
      return responseHandler.errorResponse(res, 400, "Country name and code are required");
    }

    const existingCountry = await CountryModel.findOne({
      country_name: { $regex: `^${country_name}$`, $options: "i" },
      is_deleted: false
    })
    if (existingCountry) {
      return responseHandler.errorResponse(res, 409, "Country already exists");
    }
    country_name = capitalizeFirst(country_name);
    const newCountry = await CountryModel.create({
      country_name,
      code,
      url,
      is_active
    });
    return responseHandler.successResponse(res, 201, "Country added successfully", newCountry);
  })

  // Get All Countries

  getCountries = tryCatchFn(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const { name } = req.query;

    //  correct field names
    const filter = {
      is_deleted: false
    };

    if (name) {
      filter.country_name = { $regex: name, $options: "i" };
    }

    const skip = (page - 1) * limit;

    //  filter applied here
    const countries = await CountryModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    //  COUNTS
    const [total, active, inactive] = await Promise.all([
      CountryModel.countDocuments({ is_deleted: false }),
      CountryModel.countDocuments({ is_deleted: false, is_active: true }),
      CountryModel.countDocuments({ is_deleted: false, is_active: false })
    ]);

    return responseHandler.successResponse(
      res,
      200,
      "Countries fetched successfully",
      {
        data: countries,
        counts: {
          total,
          active,
          inactive
        },
        page,
        limit
      }
    );
  });


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