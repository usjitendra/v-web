const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const path = require("path");


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

//  Multer Storage

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });


//  Cloudinary Upload 

const uploadToCloudinary = async (filePath, folder) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: "image"
  });

  return {
    publicURL: result.secure_url,
    privateURL: result.public_id
  };
};

//  delete
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
};



module.exports = {
  upload,
  uploadToCloudinary,
  deleteFromCloudinary,
  cloudinary
};
