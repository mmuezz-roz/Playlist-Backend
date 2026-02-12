import dotenv from 'dotenv';
dotenv.config();

// Safety: Render sets CLOUDINARY_URL to just the cloud name, 
// which causes the Cloudinary SDK to crash on startup during module evaluation.
// We must delete it before ANY other module imports the Cloudinary SDK.
if (process.env.CLOUDINARY_URL && !process.env.CLOUDINARY_URL.startsWith("cloudinary://")) {
    console.log("🛠️  Auto-fixing malformed CLOUDINARY_URL on Render...");
    delete process.env.CLOUDINARY_URL;
}
