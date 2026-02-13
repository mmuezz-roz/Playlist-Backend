import dotenv from 'dotenv';
dotenv.config();

// CRITICAL FIX: Delete invalid CLOUDINARY_URL before importing Cloudinary
// This prevents the SDK from crashing on startup in Render environments.
if (process.env.CLOUDINARY_URL && !process.env.CLOUDINARY_URL.startsWith('cloudinary://')) {
  delete process.env.CLOUDINARY_URL;
}

// Use dynamic import so we can manipulate process.env BEFORE the library loads
const { v2: cloudinary } = await import("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: String(process.env.Cloudinary_API_key),
  api_secret: process.env.CLOUDINARY_API_SECRET,
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

export default cloudinary;