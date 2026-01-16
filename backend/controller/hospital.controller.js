const { tryCatchFn } = require("../Utils/tryCatch.utils")
const responseHandler = require("../Utils/responseHandler.utils")
const HospitalModel = require("../model/hospital.model")
const CategoryModel = require("../model/category.model");
const { uploadToCloudinary } = require("../Utils/cloudinaryUpload");
const { image } = require("framer-motion/client");
const CountryModel = require("../model/country.model");


class hospitalController {

  // add Hospital
  addHospital = tryCatchFn(async (req, res) => {
    const {
      name,
      email,
      phone,
      address,
      countryId,
      hospitalType,
      categoryIds,
      infrastructure,
      facilities,
      teamAndSpeciality,
      youtubeVideos,
      hospitalIntro,
      numberOfBeds,
      is_active,
    } = req.body;

    console.log("add hospital", req.body, req.files);

    /* ---------- Validation ---------- */
    if (!name || !phone || !address) {
      return responseHandler.errorResponse(res, 400, "Name, phone and address are required");
    }

    if (!countryId) {
      return responseHandler.errorResponse(res, 400, "Country ID is not required");
    }

    /* ---------- Category Validation ---------- */
    if (categoryIds?.length) {
      const categories = await CategoryModel.find({
        _id: { $in: categoryIds },
        is_active: true,
        is_deleted: false,
      });

      if (categories.length !== categoryIds.length) {
        return responseHandler.errorResponse(
          res,
          404,
          "One or more categories not found"
        );
      }
    }

    /* ---------- Duplicate Hospital ---------- */
    const existHospital = await HospitalModel.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
      is_deleted: false,
    });

    if (existHospital) {
      return responseHandler.errorResponse(
        res,
        409,
        "Hospital already exists"
      );
    }

    /* ---------- Upload Image ---------- */
    const uploadImage = async (file, folder) =>
      file ? await uploadToCloudinary(file.path, folder) : null;

    const photo = await uploadImage(
      req.files?.photo?.[0],
      "hospitals/image"
    );

    let gallery = [];
    if (req.files?.gallery?.length) {
      gallery = await Promise.all(
        req.files.gallery.map((file) =>
          uploadImage(file, "hospitals/gallery")
        )
      );
    }

    /* ---------- Create Hospital ---------- */
    const hospital = await HospitalModel.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email?.toLowerCase().trim(),
      address: {
        line1: address.line1 || "",
        city: address.city || "",
        state: address.state || "",
        country: address.country || "",
        pincode: address.pincode || "",
      },
      hospitalType,
      countryId,
      categoryIds,
      numberOfBeds,
      hospitalIntro,
      infrastructure,
      facilities,
      youtubeVideos,
      teamAndSpeciality,
      photo,
      gallery,
      is_active,
    });

    /* ---------- Response ---------- */
    return responseHandler.successResponse(
      res,
      201,
      "Hospital created successfully",
      hospital
    );
  });


  //  update Hospital
  updateHospital = tryCatchFn(async (req, res) => {
    const { id } = req.params;

    const {
      name,
      email,
      phone,
      address,
      countryId,
      hospitalType,
      categoryIds,
      numberOfBeds,
      infrastructure,
      facilities,
      youtubeVideos,
      teamAndSpeciality,
      is_active,
    } = req.body || {};

    /* ---------- Find Hospital ---------- */
    const hospital = await HospitalModel.findById(id);

    if (!hospital || hospital.is_deleted) {
      throw new AppError("Hospital not found", 404);
    }

    /* ---------- Update Fields ---------- */
    if (name !== undefined) hospital.name = name.trim();
    if (email !== undefined) hospital.email = email.toLowerCase().trim();
    if (phone !== undefined) hospital.phone = phone.trim();

    if (address !== undefined) {
      hospital.address = {
        line1: address.line1 ?? hospital.address.line1,
        city: address.city ?? hospital.address.city,
        state: address.state ?? hospital.address.state,
        country: address.country ?? hospital.address.country,
        pincode: address.pincode ?? hospital.address.pincode,
      };
    }

    if (hospitalType !== undefined)
      hospital.hospitalType = hospitalType;

    if (categoryIds !== undefined)
      hospital.categoryIds = categoryIds;

    if (numberOfBeds !== undefined)
      hospital.numberOfBeds = numberOfBeds;

    if (is_active !== undefined)
      hospital.is_active = is_active;
    if (countryId !== undefined) {
      hospital.countryId = countryId;
    }
    if (infrastructure !== undefined) {
      hospital.infrastructure = infrastructure;
    }
    if (facilities !== undefined) {
      hospital.facilities = facilities;
    }
    if (teamAndSpeciality !== undefined) {
      hospital.teamAndSpeciality = teamAndSpeciality;
    }
    if (youtubeVideos !== undefined) {
      hospital.youtubeVideos = youtubeVideos;
    }
    /* ---------- Save ---------- */
    await hospital.save();

    /* ---------- Response ---------- */
    res.status(200).json({
      status: "success",
      message: "Hospital updated successfully",
      data: hospital,
    });
  });


  // delete Hospital
  deleteHospital = tryCatchFn(async (req, res) => {
    const { id } = req.params;

    const hospital = await HospitalModel.findById(id);

    if (!hospital || hospital.is_deleted) {
      throw new AppError("Hospital not found", 404);
    }

    hospital.is_deleted = true;
    hospital.is_active = false;

    await hospital.save();

    res.status(200).json({
      status: "success",
      message: "Hospital deleted successfully",
    });
  });


  // getAll Hospital

  getAllHospital = tryCatchFn(async (req, res) => {
    const { page = 1, limit = 10, search } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const filter = {
      is_deleted: false,
    };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const pipeline = [
      { $match: filter },

      /* ---------- Category Lookup ---------- */
      {
        $lookup: {
          from: "categories",
          localField: "categoryIds",
          foreignField: "_id",
          as: "categories",
        },
      },
      {
        $lookup: {
          from: "countries",
          localField: "countryId",
          foreignField: "_id",
          as: "countryData",
        },
      },
      {
        $unwind: "$countryData"
      },
      {
        $unwind: "$categories"
      },
      {
        $lookup: {
          from: "subcategories",
          localField: "categories._id",
          foreignField: "categoryId",
          as: "categories.subcategories"
        }
      },

      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limitNumber },

      /* ---------- Projection ---------- */
      {
        $project: {
          name: 1,
          slug: 1,
          phone: 1,
          address: 1,
          numberOfBeds: 1,
          infrastructure: 1,
          facilities: 1,
          youtubeVideos: 1,
          hospitalIntro: 1,
          countryData: 1,
          teamAndSpeciality: 1,
          hospitalType: 1,
          categories: {
            category_name: 1,
            _id: 1,
            subcategories: { _id: 1, subcategory_name: 1 }
          },
          is_active: 1,
          createdAt: 1,
        },
      },
    ];

    const [data, total] = await Promise.all([
      HospitalModel.aggregate(pipeline),
      HospitalModel.countDocuments(filter),
    ]);

    console.log("get all hospitals", data);

    return responseHandler.successResponse(
      res,
      200,
      "Hospital fetched successfully",
      {
        data,
        pagination: {
          total,
          page: pageNumber,
          limit: limitNumber,
          totalPages: Math.ceil(total / limitNumber),
        },
        hospitalCount: {
          totalHospitals: total,
          activeHospitals: data.filter(h => h.is_active).length,
          inactiveHospitals: data.filter(h => !h.is_active).length,
        }
      },

    );
  });

  getAllHospitalList = tryCatchFn(async (req, res) => {
    const {
      city,
      state,
      country,
      category,
      page = 1,
      limit = 10,
    } = req.query;

    const matchStage = {
      is_deleted: false,
      is_active: true,
    };

    /* ---------------- COUNTRY NAME -> ObjectId ---------------- */
    if (country) {
      const countryDoc = await CountryModel.findOne({
        country_name: { $regex: country, $options: "i" },
      }).select("_id");

      if (!countryDoc) {
        return responseHandler.successResponse(res, 200, "Hospital fetched successfully", {
          data: [],
          total: 0,
          page: Number(page),
          limit: Number(limit),
        });
      }

      matchStage.countryId = countryDoc._id;
    }

    /* ---------------- CATEGORY SLUG -> ObjectId ---------------- */
    if (category) {
      const categoryDoc = await CategoryModel.findOne({
        slug: category,
      }).select("_id");

      if (!categoryDoc) {
        return responseHandler.successResponse(res, 200, "Hospital fetched successfully", {
          data: [],
          total: 0,
          page: Number(page),
          limit: Number(limit),
        });
      }

      // categoryIds is ARRAY
      matchStage.categoryIds = categoryDoc._id;
    }

    /* ---------------- LOCATION FILTERS ---------------- */
    if (city) {
      matchStage["address.city"] = { $regex: city, $options: "i" };
    }

    if (state) {
      matchStage["address.state"] = { $regex: state, $options: "i" };
    }

    const skip = (Number(page) - 1) * Number(limit);

    /* ---------------- AGGREGATION PIPELINE ---------------- */
    const pipeline = [
      { $match: matchStage },

      { $sort: { createdAt: -1 } },

      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: Number(limit) },

            /* ---- COUNTRY ---- */
            {
              $lookup: {
                from: "countries",
                localField: "countryId",
                foreignField: "_id",
                as: "countryData",
              },
            },
            { $unwind: { path: "$countryData", preserveNullAndEmptyArrays: true } },

            /* ---- CATEGORIES ---- */
            {
              $lookup: {
                from: "categories",
                localField: "categoryIds",
                foreignField: "_id",
                as: "categoryData",
              },
            },

            { $unwind: { path: "$categoryData", preserveNullAndEmptyArrays: true } },

            /* ---- PROJECTION ---- */
            {
              $project: {
                name: 1,
                slug: 1,
                phone: 1,
                address: 1,
                hospitalType: 1,
                numberOfBeds: 1,
                photo: 1,
                gallery: 1,
                facilities: 1,
                hospitalIntro: 1,
                createdAt: 1,
                countryData: {
                  _id: "$countryData._id",
                  name: "$countryData.country_name",
                  slug: "$countryData.slug",
                  code: "$countryData.code",
                  image: "$countryData.image",
                },
                categoryData: {
                  _id: "$categoryData._id",
                  name: "$categoryData.category_name",
                  slug: "$categoryData.slug",
                  image: "$categoryData.image",
                  description: "$categoryData.description",
                },
              },
            },
          ],

          total: [
            { $count: "count" },
          ],
        },
      },
    ];

    const result = await HospitalModel.aggregate(pipeline);

    const hospitals = result[0]?.data || [];
    const total = result[0]?.total[0]?.count || 0;

    return responseHandler.successResponse(res, 200, "Hospital fetched successfully", {
      data: hospitals,
      total,
      page: Number(page),
      limit: Number(limit),
    });
  });


  getHospitalBySlug = tryCatchFn(async (req, res) => {
    const { slug } = req.params;

    const hospital = await HospitalModel.findOne({ slug, is_deleted: false, is_active: true })
      .populate("countryId", "country_name slug code image")
      .populate("categoryIds", "category_name slug image description");

    if (!hospital) {
      return responseHandler.errorResponse(res, 404, "Hospital not found");
    }

    return responseHandler.successResponse(res, 200, "Hospital fetched successfully", hospital);
  });


}


module.exports = new hospitalController();
