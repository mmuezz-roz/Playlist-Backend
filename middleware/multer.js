import multer from "multer";

// Broad audio MIME type support for cross-browser/OS compatibility
const allowedAudioTypes = [
  "audio/mpeg",       // .mp3
  "audio/mp3",        // .mp3 (some browsers)
  "audio/wav",        // .wav
  "audio/wave",       // .wav (alternate MIME)
  "audio/x-wav",      // .wav (alternate MIME)
  "audio/mp4",        // .m4a / .mp4 audio
  "audio/m4a",        // .m4a
  "audio/x-m4a",      // .m4a (alternate MIME)
  "audio/aac",        // .aac
  "audio/ogg",        // .ogg
  "audio/webm",       // .webm audio
  "audio/flac",       // .flac
  "video/mp4",        // Some browsers report .m4a as video/mp4
];

const allowedImageTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

// File filter for audio and image files
const fileFilter = (req, file, cb) => {
  console.log(`[Multer] Received file: field="${file.fieldname}", mimetype="${file.mimetype}", originalname="${file.originalname}"`);

  if (file.fieldname === "file") {
    if (allowedAudioTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      console.error(`[Multer] Rejected audio file with mimetype: ${file.mimetype}`);
      cb(new Error(`Unsupported audio file type: ${file.mimetype}. Allowed: MP3, WAV, M4A, AAC, OGG, FLAC`), false);
    }
  } else if (file.fieldname === "coverImage") {
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      console.error(`[Multer] Rejected image file with mimetype: ${file.mimetype}`);
      cb(new Error(`Unsupported image file type: ${file.mimetype}. Allowed: JPEG, PNG, WEBP, GIF`), false);
    }
  } else {
    cb(new Error(`Unexpected field: ${file.fieldname}`), false);
  }
};

// Use memory storage — NEVER disk storage (disk doesn't work on Vercel serverless)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB per file
    files: 2,                    // Max 2 files (1 audio + 1 image)
  },
});

export default upload;