const multer = require("multer");
const path = require("path");
const folderNames = require("../Constants/folderConstant.constant");

const storage = multer.diskStorage({

  destination: (req, _, cb) => cb(null, req.uploadPath),

  filename: (req, file, cb) =>
    cb(
      null,
      req.params.folderName +
        "-" +
        Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname).toLowerCase()
    ),
});


const fileFilter = (req, file, cb) => {
  // console.log("file:",file)
  const allowedFileTypes = [
    ".jpg",
    ".jpeg",
    ".png",
    ".pdf",
    ".doc",
    ".docx",
    ".webp",
    ".csv",
    ".xlsx",
    ".audio/webm",
    ".webm",
    ".audio/mpeg",
    ".audio",
    ".mpeg",
    ".mp4"
  ];

  const extname = path.extname(file.originalname).toLowerCase();
  if (!Object.keys(folderNames).includes(req.params.folderName)) {
    const error = new Error("Invalid directory.");
    error.status = 400;
    return cb(error, false);
  }

   if (allowedFileTypes.includes(extname)) {
    cb(null, true);
  } else {
    const error = new Error("File type not supported.");
    error.status = 400;
    cb(error, false);
  }
};

const singleUpload = multer({ storage, fileFilter }).single("file");
const multipleUpload = multer({ storage, fileFilter }).array("files", 10); // up to 10 files

module.exports = {
  singleUpload,
  multipleUpload,
};
