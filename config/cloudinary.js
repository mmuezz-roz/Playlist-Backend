import dotenv from 'dotenv'
dotenv.config();

// Fix for Render/Vercel environments: Cloudinary SDK crashes if CLOUDINARY_URL is
// present but doesn't start with 'cloudinary://'
if (process.env.CLOUDINARY_URL && !process.env.CLOUDINARY_URL.startsWith('cloudinary://')) {
  console.warn("[Cloudinary] Invalid CLOUDINARY_URL detected. Removing it to prevent SDK crash.");
  delete process.env.CLOUDINARY_URL;
}

import { v2 as cloudinary } from 'cloudinary';

// Support both casing variants for the API key env variable
// In Vercel dashboard, make sure to use CLOUDINARY_API_KEY (all caps)
const apiKey = process.env.CLOUDINARY_API_KEY || process.env.Cloudinary_API_key;

console.log("[Cloudinary] Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME || "MISSING");
console.log("[Cloudinary] API Key set:", !!apiKey);
console.log("[Cloudinary] API Secret set:", !!process.env.CLOUDINARY_API_SECRET);

if (!process.env.CLOUDINARY_CLOUD_NAME || !apiKey || !process.env.CLOUDINARY_API_SECRET) {
  console.error("[Cloudinary] ⚠️  One or more Cloudinary env vars are missing! Uploads will fail.");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: apiKey,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload an audio file buffer to Cloudinary.
 * Uses resource_type: "auto" to support mp3, wav, m4a, aac, ogg, flac, etc.
 */
export const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer || fileBuffer.length === 0) {
      return reject(new Error("Empty file buffer provided to uploadToCloudinary"));
    }

    console.log(`[Cloudinary] Uploading audio buffer (${fileBuffer.length} bytes)...`);

    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",  // "auto" handles audio, video, images
        folder: "songs",
        timeout: 60000,         // 60 second timeout for large audio files
      },
      (error, result) => {
        if (error) {
          console.error("[Cloudinary] Audio upload error:", JSON.stringify(error));
          reject(new Error(`Cloudinary audio upload failed: ${error.message || JSON.stringify(error)}`));
        } else {
          console.log("[Cloudinary] Audio upload success. URL:", result.secure_url);
          resolve(result.secure_url);
        }
      }
    );

    stream.on('error', (err) => {
      console.error("[Cloudinary] Stream error:", err.message);
      reject(new Error(`Cloudinary stream error: ${err.message}`));
    });

    stream.end(fileBuffer);
  });
};

/**
 * Upload an image file buffer to Cloudinary.
 */
export const uploadImageToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer || fileBuffer.length === 0) {
      return reject(new Error("Empty file buffer provided to uploadImageToCloudinary"));
    }

    console.log(`[Cloudinary] Uploading image buffer (${fileBuffer.length} bytes)...`);

    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        folder: "song_covers",
        transformation: [
          { width: 500, height: 500, crop: "limit" },
          { quality: "auto" }
        ],
        timeout: 30000,
      },
      (error, result) => {
        if (error) {
          console.error("[Cloudinary] Image upload error:", JSON.stringify(error));
          reject(new Error(`Cloudinary image upload failed: ${error.message || JSON.stringify(error)}`));
        } else {
          console.log("[Cloudinary] Image upload success. URL:", result.secure_url);
          resolve(result.secure_url);
        }
      }
    );

    stream.on('error', (err) => {
      console.error("[Cloudinary] Image stream error:", err.message);
      reject(new Error(`Cloudinary image stream error: ${err.message}`));
    });

    stream.end(fileBuffer);
  });
};

export default cloudinary;