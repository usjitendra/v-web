const CountryModel = require('../model/country.model');
const LanguageMode = require('../model/language.model');
const { tryCatchFn } = require('../Utils/tryCatch.utils');
const responseHandler = require('../Utils/responseHandler.utils');
const CategoryModel = require('../model/category.model');
const SubCategoryModel = require('../model/subcategory.model');

const slugify = require("slugify");


async function addSlugToOldCountries() {
  const countries = await CountryModel.find({
    slug: { $exists: false },
    is_deleted: false,
  });

  for (const country of countries) {
    let baseSlug = slugify(country.country_name, { lower: true, strict: true, trim: true });
    let slug = baseSlug;
    let count = 1;

    while (await CountryModel.exists({ slug, is_deleted: false, _id: { $ne: country._id } })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    country.slug = slug;
    await country.save();
  }

  console.log(" Old data slug migration completed");
}

// run script
// addSlugToOldCountries()
//   .then(() => process.exit(0))
//   .catch(err => {
//     console.error(err);
//     process.exit(1);
//   });


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
          from: "languages",
          localField: "_id",
          foreignField: "_id",
          as: "country"
        }
      },
      { $unwind: "$country" },
      {
        $project: {
          _id: 1,
          language_name: 1,
          countryID: 1,
          country_name: "$country.country_name",
          country_code: "$country.code"
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

    const pipeline = [
      {
        $match: { is_deleted: false, is_active: true }
      },
      {
        $lookup: {
          from: "subcategories",
          let: { categoryId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$categoryId", "$$categoryId"] },
                    { $eq: ["$is_deleted", false] },
                    { $eq: ["$is_active", true] }
                  ]
                }
              }
            },
            {
              $project: {
                _id: 1,
                subcategory_name: 1
              }
            }
          ],
          as: "subcategories"
        }
      },
      {
        $project: {
          _id: 1,
          category_name: 1,
          subcategories: 1
        }
      },
      {
        $sort: { category_name: 1 }
      }
    ];

    const result = await CategoryModel.aggregate(pipeline);

    return responseHandler.successResponse(
      res,
      200,
      "Categories fetched successfully",
      result
    );
  });

  countryCategory = tryCatchFn(async (req, res) => {

    const countries = await CountryModel.find({ is_active: true, is_deleted: false },
      { _id: 1, country_name: 1, slug: 1 }
    )
    const categories = await CategoryModel.find({ is_active: true, is_deleted: false },
      { _id: 1, category_name: 1, slug: 1 }
    )

    const result = countries.map(country => ({
      countryId: country._id,
      countryName: country.country_name,
      slugName: country.slug,
      categories: categories.map(cat => ({
        categoryId: cat._id,
        categoryName: cat.category_name,
        slugName: cat.slug
      }))
    }));



    return responseHandler.successResponse(
      res,
      200,
      "Categories Cuntry fetched successfully",
      {
        result
      }
    );
  })




}


module.exports = new dropdownController();