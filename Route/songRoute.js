import express from 'express'
import { getAllsongs, getAsong, saveSong } from '../Controllers/songController.js';
import Verifytoken from '../middleware/varifyToken.js';
import { generateSignedUploadParams } from '../config/cloudinary.js';

const songRoute = express.Router()

/**
 * GET /sign-upload?type=audio|image
 *
 * Returns Cloudinary signed upload parameters.
 * The frontend uses these to upload files DIRECTLY to Cloudinary,
 * bypassing Vercel's 4.5MB body size limit entirely.
 */
songRoute.get("/sign-upload", Verifytoken, (req, res) => {
    try {
        const type = req.query.type === "image" ? "image" : "auto";
        const folder = type === "image" ? "song_covers" : "songs";

        console.log(`[sign-upload] Generating signature for type=${type}, folder=${folder}`);
        const params = generateSignedUploadParams(folder, type);

        res.status(200).json(params);
    } catch (error) {
        console.error("[sign-upload] Error:", error.message);
        res.status(500).json({ error: "Failed to generate upload signature", details: error.message });
    }
});

/**
 * POST /addSong
 *
 * Saves song metadata to MongoDB AFTER frontend has uploaded files directly to Cloudinary.
 * Body: { title, artist, audioUrl, coverImageUrl? }
 * This is a small JSON-only request — no files, no multer, no body size issues.
 */
songRoute.post("/addSong", Verifytoken, saveSong)

songRoute.get("/getsongs", getAllsongs)
songRoute.get("/getOneSong/:id", getAsong)

export default songRoute