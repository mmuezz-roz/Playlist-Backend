import multer from "multer";
import path from "path";

// File filter for audio and image files
const fileFilter = (req, file, cb) => {
  // Audio files (for the 'file' field)
  const allowedAudio = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/m4a"];

  // Image files (for the 'coverImage' field)
  const allowedImages = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (file.fieldname === "file") {
    // Validate audio file
    if (allowedAudio.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only audio files (MP3, WAV, M4A) are allowed for song file"), false);
    }
  } else if (file.fieldname === "coverImage") {
    // Validate image file
    if (allowedImages.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (JPEG, JPG, PNG, WEBP) are allowed for cover image"), false);
    }
  } else {
    cb(new Error("Unexpected field"), false);
  }
};

// File size limits
const limits = {
  fileSize: 50 * 1024 * 1024, // 50MB max for audio files
  files: 2 // Maximum 2 files (1 audio + 1 image)
};

// Use memory storage for Cloudinary upload
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter,
  limits
});

export default upload;