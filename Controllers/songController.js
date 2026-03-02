import { SongModel } from "../Models/song.js";

/**
 * POST /addSong
 * Receives JSON: { title, artist, audioUrl, coverImageUrl? }
 * Files are already uploaded to Cloudinary directly from the browser.
 */
export const saveSong = async (req, res) => {
    try {
        console.log("[saveSong] Body:", req.body);

        const { title, artist, audioUrl, coverImageUrl } = req.body;

        if (!title || !artist) {
            return res.status(400).json({ error: "Title and artist are required" });
        }

        if (!audioUrl) {
            return res.status(400).json({ error: "Audio URL is required. Upload the file to Cloudinary first." });
        }

        const alreadyexist = await SongModel.findOne({ title, artist });
        if (alreadyexist) {
            return res.status(400).json({ message: "This song is already uploaded!" });
        }

        const song = await SongModel.create({
            title,
            artist,
            filepath: audioUrl,
            coverImage: coverImageUrl || null
        });

        console.log("[saveSong] Saved to DB:", song._id);
        res.status(201).json({ message: "Song uploaded successfully!", song });

    } catch (error) {
        console.error("[saveSong] Error:", error.message);
        res.status(500).json({
            error: "Internal server error while saving song",
            details: error.message
        });
    }
};

export const getAllsongs = async (req, res) => {
    try {
        const songs = await SongModel.find().sort({ createdAt: -1 });
        res.status(200).json({ message: "Found Songs!", data: songs });
    } catch (error) {
        console.error("[getAllsongs] Error:", error.message);
        res.status(500).json({ error: "Failed to retrieve songs", details: error.message });
    }
};

export const getAsong = async (req, res) => {
    try {
        const { id } = req.params;
        const song = await SongModel.findById(id);

        if (!song) {
            return res.status(404).json({ message: "Song not found" });
        }

        res.status(200).json({ message: "Found A Song!", data: song });
    } catch (error) {
        console.error("[getAsong] Error:", error.message);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};