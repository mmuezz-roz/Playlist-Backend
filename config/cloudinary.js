import dotenv from 'dotenv'
dotenv.config();

// Fix for environments where CLOUDINARY_URL is invalid
if (process.env.CLOUDINARY_URL && !process.env.CLOUDINARY_URL.startsWith('cloudinary://')) {
  console.warn("[Cloudinary] Invalid CLOUDINARY_URL detected. Removing it.");
  delete process.env.CLOUDINARY_URL;
}

import { v2 as cloudinary } from 'cloudinary';

// Support both env var casings (Vercel dashboard uses ALL_CAPS)
const apiKey = process.env.CLOUDINARY_API_KEY || process.env.Cloudinary_API_key;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

console.log("[Cloudinary] Cloud Name:", cloudName || "❌ MISSING");
console.log("[Cloudinary] API Key set:", !!apiKey);
console.log("[Cloudinary] API Secret set:", !!apiSecret);

if (!cloudName || !apiKey || !apiSecret) {
  console.error("[Cloudinary] ⚠️  Missing env vars! Uploads will fail.");
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

/**
 * Generate a signed upload URL for direct-to-Cloudinary uploads from the frontend.
 * This bypasses Vercel's 4.5MB body size limit entirely.
 */
export const generateSignedUploadParams = (folder = "songs", resourceType = "auto") => {
  const timestamp = Math.round(new Date().getTime() / 1000);

  const paramsToSign = {
    timestamp,
    folder,
  };

  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

  return {
    signature,
    timestamp,
    cloudName,
    apiKey,
    folder,
    resourceType,
  };
};

export default cloudinary;