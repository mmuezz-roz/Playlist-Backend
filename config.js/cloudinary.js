import dotenv from 'dotenv'
dotenv.config();

// Fix for Render environment variable issue: 
// Cloudinary SDK crashes if CLOUDINARY_URL is present but doesn't start with 'cloudinary://'
if (process.env.CLOUDINARY_URL && !process.env.CLOUDINARY_URL.startsWith('cloudinary://')) {
  console.warn("Invalid CLOUDINARY_URL detected. Removing it to prevent Cloudinary SDK crash.");
  lete process.env.CLOUDINARY_URL;
}

const { v2: cloudinary } = await import("cloudinary");

console.log("Initializing Cloudinary with Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.Cloudinary_API_key,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

export const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    console.log("Starting Cloudinary upload stream...");
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