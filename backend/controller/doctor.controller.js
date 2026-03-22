const { tryCatchFn } = require("../Utils/tryCatch.utils");
const DoctorModel = require("../model/doctor.model");
const CountryModel = require("../model/country.model")
const SubCategoryModel = require('../model/subcategory.model')
const responseHandler = require("../Utils/responseHandler.utils");
const { uploadToCloudinary } = require("../Utils/cloudinaryUpload");
const CategoryModel = require("../model/category.model");
const slugify = require("slugify");


class DoctorController {
  // --- ADD DOCTOR ---

  addDoctor = tryCatchFn(async (req, res) => {
    const {
      name,
      email,
      phone,
      categoryId,
      conteryId,
      subCategoryId,
      location,
      experience,
      workAt,
      about,
      medicalProblems,
      medicalProcedures,
      workExperience,
      educationAndTraining,
      honoursAndAwards,
      youtubeVideo,
      is_active
    } = req.body;


    console.log("add data", req.body)
    // --- HELPER ---
    const parseArray = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      try {
        return JSON.parse(val);
      } catch {
        return [];
      }
    };

    const parseObject = (val) => {
      if (!val) return {};
      if (typeof val === "object") return val;
      try {
        return JSON.parse(val);
      } catch {
        return {};
      }
    };

    console.log("doctore", req.body);

    if (!name || !email || !phone || !categoryId) {
      return responseHandler.errorResponse(
        res,
        400,
        "Name, Email, Phone, and Category ID are required"
      );
    }

    const counter = await CountryModel.findById(conteryId);
    if (!counter || counter.is_deleted) {
      return responseHandler.errorResponse(res, 404, "Countery not found");
    }

    const parsedSubCategoryId = parseArray(subCategoryId);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return responseHandler.errorResponse(res, 400, "Invalid email format");
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return responseHandler.errorResponse(res, 400, "Invalid mobile number");
    }

    // --- SLUG CHECK ---
    const slug = slugify(name, { lower: true, strict: true });
    if (await DoctorModel.findOne({ slug, is_deleted: false })) {
      return responseHandler.errorResponse(
        res,
        409,
        "Doctor with similar name already exists"
      );
    }

    // --- CATEGORY CHECK ---
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      return responseHandler.errorResponse(res, 404, "Category not found");
    }

    // --- SUBCATEGORY VALIDATION (PARSED VALUE) ---
    if (parsedSubCategoryId.length) {
      const validSubCategories = await SubCategoryModel.find({
        _id: { $in: parsedSubCategoryId },
        categoryId,
        is_deleted: false,
        is_active: true
      });

      if (validSubCategories.length !== parsedSubCategoryId.length) {
        return responseHandler.errorResponse(
          res,
          400,
          "Invalid subCategoryId for the given categoryId"
        );
      }
    }

    // --- DUPLICATE DOCTOR CHECK ---
    const existingDoctor = await DoctorModel.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
      is_deleted: false
    });

    if (existingDoctor) {
      return responseHandler.errorResponse(
        res,
        409,
        "Doctor with this name already exists"
      );
    }

    // --- FILE UPLOAD VALIDATION ---
    if (req.files?.gallery?.length > 10) {
      return responseHandler.errorResponse(
        res,
        400,
        "Maximum 10 images allowed in gallery"
      );
    }

    // --- FILE UPLOAD ---
    const uploadImage = async (file, folder) =>
      file ? await uploadToCloudinary(file.path, folder) : null;

    const imageData = await uploadImage(
      req.files?.image?.[0],
      "subcategories"
    );

    let gallery = [];
    if (req.files?.gallery?.length) {
      gallery = await Promise.all(
        req.files.gallery.map((file) =>
          uploadImage(file, "doctors/gallery")
        )
      );
    }

    // --- CREATE DOCTOR ---
    const doctor = await DoctorModel.create({
      name,
      email: email.toLowerCase(),
      phone: phone.trim(),
      categoryId,
      conteryId,
      subCategoryId: parsedSubCategoryId,
      location: parseObject(location),
      experience,
      workAt,
      about,
      medicalProblems: parseArray(medicalProblems),
      medicalProcedures: parseArray(medicalProcedures),
      workExperience,
      educationAndTraining: parseArray(educationAndTraining),
      honoursAndAwards: parseArray(honoursAndAwards),
      youtubeVideo: parseObject(youtubeVideo),
      is_active: is_active === "true" || is_active === true,
      image: imageData,
      gallery
    });

    return responseHandler.successResponse(
      res,
      201,
      "Doctor created successfully",
      doctor
    );
  });

  // --- GET ALL DOCTORS ---
  getAllDoctors = tryCatchFn(async (req, res) => {
    const { page = 1, limit = 10, search } = req.query;
    const query = { is_deleted: false };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }



    const [data, total, activeDoctors, totalDoctors] = await Promise.all([
      DoctorModel.find(query)
        .populate("categoryId")
        .populate("subCategoryId")
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),
      DoctorModel.countDocuments(query),
      DoctorModel.countDocuments({ is_deleted: false, is_active: true }),
      DoctorModel.countDocuments({ is_deleted: false })

    ])

    return responseHandler.successResponse(res, 200, "Doctors fetched successfully", {
      data,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
      },
      doctoreCount: {
        totalDoctors: totalDoctors,
        activeDoctors: activeDoctors,
        inactiveDoctors: totalDoctors - activeDoctors
      }

    });
  });

  // --- UPDATE DOCTOR ---
  updateDoctor = tryCatchFn(async (req, res) => {
    const doctorId = req.params.id;
    if (!doctorId) {
      return responseHandler.errorResponse(res, 400, "Doctor ID is required");
    }

    // SAFETY
    req.body = req.body || {};

    const {
      name,
      email,
      phone,
      categoryId,
      conteryId,
      subCategoryId,
      location,
      experience,
      workAt,
      about,
      medicalProblems,
      medicalProcedures,
      workExperience,
      educationAndTraining,
      honoursAndAwards,
      youtubeVideo,
      is_active
    } = req.body;

    console.log("UPDATE BODY:", req.body);

    const doctor = await DoctorModel.findById(doctorId);
    if (!doctor || doctor.is_deleted) {
      return responseHandler.errorResponse(res, 404, "Doctor not found");
    }

    // ---------- HELPERS (SAME AS ADD) ----------
    const parseArray = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      try {
        return JSON.parse(val);
      } catch {
        return [];
      }
    };

    const parseObject = (val) => {
      if (!val) return {};
      if (typeof val === "object") return val;
      try {
        return JSON.parse(val);
      } catch {
        return {};
      }
    };

    // ---------- VALIDATIONS ----------
    if (name) {
      const slug = slugify(name, { lower: true, strict: true });
      const slugExists = await DoctorModel.findOne({
        slug,
        _id: { $ne: doctorId },
        is_deleted: false
      });
      if (slugExists) {
        return responseHandler.errorResponse(
          res,
          409,
          "Doctor with similar name already exists"
        );
      }
      doctor.name = name;
      doctor.slug = slug;
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return responseHandler.errorResponse(res, 400, "Invalid email format");
      }

      const emailExists = await DoctorModel.findOne({
        email: email.toLowerCase(),
        _id: { $ne: doctorId }
      });
      if (emailExists) {
        return responseHandler.errorResponse(
          res,
          409,
          "Another doctor with this email already exists"
        );
      }
      doctor.email = email.toLowerCase();
    }

    if (phone) {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(phone)) {
        return responseHandler.errorResponse(res, 400, "Invalid mobile number");
      }
      doctor.phone = phone.trim();
    }

    if (categoryId) {
      const category = await CategoryModel.findById(categoryId);
      if (!category) {
        return responseHandler.errorResponse(res, 404, "Category not found");
      }
      doctor.categoryId = categoryId;
    }

    // ---------- SUB CATEGORY (SAME AS ADD) ----------
    const parsedSubCategoryId = parseArray(subCategoryId);

    if (parsedSubCategoryId.length) {
      const validSubCategories = await SubCategoryModel.find({
        _id: { $in: parsedSubCategoryId },
        categoryId: categoryId || doctor.categoryId,
        is_deleted: false,
        is_active: true
      });

      if (validSubCategories.length !== parsedSubCategoryId.length) {
        return responseHandler.errorResponse(
          res,
          400,
          "Invalid subCategoryId for the given categoryId"
        );
      }

      doctor.subCategoryId = parsedSubCategoryId;
    }

    // ---------- FILE UPLOAD ----------
    const uploadImage = async (file, folder) =>
      file ? await uploadToCloudinary(file.path, folder) : null;

    if (req.files?.image?.length) {
      doctor.image = await uploadImage(req.files.image[0], "subcategories");
    }

    if (req.files?.gallery?.length) {
      if (req.files.gallery.length > 10) {
        return responseHandler.errorResponse(
          res,
          400,
          "Maximum 10 images allowed in gallery"
        );
      }

      doctor.gallery = await Promise.all(
        req.files.gallery.map((file) =>
          uploadImage(file, "doctors/gallery")
        )
      );
    }

    // ---------- OPTIONAL FIELDS ----------
    if (conteryId) doctor.conteryId = conteryId
    if (location) doctor.location = parseObject(location);
    if (experience) doctor.experience = experience;
    if (workAt) doctor.workAt = workAt;
    if (about) doctor.about = about;
    if (medicalProblems)
      doctor.medicalProblems = parseArray(medicalProblems);
    if (medicalProcedures)
      doctor.medicalProcedures = parseArray(medicalProcedures);
    if (workExperience) doctor.workExperience = workExperience;
    if (educationAndTraining) {
      doctor.educationAndTraining = Array.isArray(educationAndTraining)
        ? educationAndTraining
        : JSON.parse(educationAndTraining);
    }
    if (honoursAndAwards)
      doctor.honoursAndAwards = parseArray(honoursAndAwards);
    if (youtubeVideo)
      doctor.youtubeVideo = parseObject(youtubeVideo);

    // ---------- STATUS (MOST IMPORTANT FIX) ----------
    if (is_active !== undefined) {
      doctor.is_active = is_active === "true" || is_active === true;
    }

    await doctor.save();

    return responseHandler.successResponse(
      res,
      200,
      "Doctor updated successfully",
      doctor
    );
  });


  // --- DELETE DOCTOR ---
  deleteDoctor = tryCatchFn(async (req, res) => {
    const { id } = req.params;

    const doctor = await DoctorModel.findOneAndUpdate(
      { _id: id },
      { is_deleted: true, is_active: false },
      { new: true }
    );

    if (!doctor) {
      return responseHandler.errorResponse(
        res,
        404,
        "Doctor not found"
      );
    }

    return responseHandler.successResponse(
      res,
      200,
      "Doctor deleted successfully"
    );
  });

  // /--- GET DOCTOR BY ID ---
  getDoctorById = tryCatchFn(async (req, res) => {
    const { id } = req.params;
    const doctor = await DoctorModel.findById(id)
      .populate("categoryId")
      .populate("subCategoryId");

    if (!doctor || doctor.is_deleted) {
      return responseHandler.errorResponse(res, 404, "Doctor not found");
    }

    return responseHandler.successResponse(
      res,
      200,
      "Doctor fetched successfully",
      doctor
    );
  });


  getAllDoctorList = tryCatchFn(async (req, res) => {
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
        return responseHandler.successResponse(res, 200, "Doctor fetched successfully", {
          data: [],
          total: 0,
          page: Number(page),
          limit: Number(limit),
        });
      }

      matchStage.conteryId = countryDoc._id;
    }

    /* ---------------- CATEGORY SLUG -> ObjectId ---------------- */
    if (category) {
      const categoryDoc = await CategoryModel.findOne({
        slug: category,
      }).select("_id");

      if (!categoryDoc) {
        return responseHandler.successResponse(res, 200, "Doctor fetched successfully", {
          data: [],
          total: 0,
          page: Number(page),
          limit: Number(limit),
        });
      }

      matchStage.categoryId = categoryDoc._id;
    }

    /* ---------------- LOCATION FILTERS ---------------- */
    if (city) {
      matchStage["location.city"] = { $regex: city, $options: "i" };
    }

    if (state) {
      matchStage["location.state"] = { $regex: state, $options: "i" };
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

            /* ---- CATEGORY ---- */
            {
              $lookup: {
                from: "categories",
                localField: "categoryId",
                foreignField: "_id",
                as: "categoryData",
              },
            },
            { $unwind: { path: "$categoryData", preserveNullAndEmptyArrays: true } },

            /* ---- COUNTRY ---- */
            {
              $lookup: {
                from: "countries",
                localField: "conteryId",
                foreignField: "_id",
                as: "conteryData",
              },
            },
            { $unwind: { path: "$conteryData", preserveNullAndEmptyArrays: true } },

            /* ---- SUB CATEGORY ---- */
            {
              $lookup: {
                from: "subcategories",
                localField: "subCategoryId",
                foreignField: "_id",
                as: "subCategoryData",
              },
            },

            { $unwind: { path: "$subCategoryData", preserveNullAndEmptyArrays: true } },

            /* ---- PROJECTION (optional but recommended) ---- */
            {
              $project: {
                name: 1,
                email: 1,
                phone: 1,
                location: 1,
                experience: 1,
                slug: 1,
                image: 1,
                createdAt: 1,
                categoryData: {
                  name: "$categoryData.category_name",
                  slug: "$categoryData.slug",
                  image: "$categoryData.image",
                  description: "$categoryData.description",
                },

                conteryData: {
                  name: "$conteryData.country_name",
                  slug: "$conteryData.slug",
                  code: "$conteryData.code",
                },
                subCategoryData: {
                  name: "$subCategoryData.subcategory_name",
                  slug: "$subCategoryData.slug",
                  image: "$subCategoryData.image",
                  description: "$subCategoryData.description",
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

    const result = await DoctorModel.aggregate(pipeline);

    const doctors = result[0]?.data || [];
    const total = result[0]?.total[0]?.count || 0;

    return responseHandler.successResponse(res, 200, "Doctor fetched successfully", {
      data: doctors,
      total,
      page: Number(page),
      limit: Number(limit),
    });
  });

  getDoctorBySlug = tryCatchFn(async (req, res) => {
    const { slug } = req.params;

    const doctor = await DoctorModel.findOne({ slug, is_deleted: false, is_active: true })
      .populate("categoryId")
      .populate("subCategoryId")
      .populate("conteryId");

    if (!doctor) {
      return responseHandler.errorResponse(res, 404, "Doctor not found");
    }

    return responseHandler.successResponse(
      res,
      200,
      "Doctor fetched successfully",
      doctor
    );
  });


}

module.exports = new DoctorController();


