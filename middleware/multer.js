import multer from "multer";
import path from "path";

// only mp3 accepted
const fileFilter = (req, file, cb) => {
  const allowed = ["audio/mpeg", "audio/mp3"];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .mp3 files are allowed"), false);
  }
};


// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");       
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

const storage = multer.memoryStorage();

const upload = multer({ storage, fileFilter });

export default upload;