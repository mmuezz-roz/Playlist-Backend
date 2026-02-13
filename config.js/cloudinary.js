import dotenv from 'dotenv'
dotenv.config();

// Fix for Render environment variable issue: 
// Cloudinary SDK crashes if CLOUDINARY_URL is present but doesn't start with 'cloudinary://'
if (process.env.CLOUDINARY_URL && !process.env.CLOUDINARY_URL.startsWith('cloudinary://')) {
  console.warn("Invalid CLOUDINARY_URL detected. Removing it to prevent Cloudinary SDK crash.");
  delete process.env.CLOUDINARY_URL;
}

const { v2: cloudinary } = await import("cloudinary");

// Get keys with fallback for different casings
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.Cloudinary_API_key || process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error("CRITICAL: Missing Cloudinary credentials!", {
    hasCloudName: !!cloudName,
    hasApiKey: !!apiKey,
    hasApiSecret: !!apiSecret
  });
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true
})

export const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "songs",
      },
      (error, result) => {
        if (error) {
          console.log("Cloudinary upload error:", error);
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    stream.end(fileBuffer);
  });
};


export default cloudinary