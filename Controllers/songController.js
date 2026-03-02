import { SongModel } from "../Models/song.js";
import { uploadToCloudinary, uploadImageToCloudinary } from "../config/cloudinary.js";

export const uploadSong = async (req, res) => {
    try {
        console.log("[uploadSong] Handler triggered");
        console.log("[uploadSong] Content-Type:", req.headers['content-type']);
        console.log("[uploadSong] Body fields:", req.body);
        console.log("[uploadSong] Files received:", req.files
            ? Object.keys(req.files).map(k => `${k}: ${req.files[k][0]?.originalname} (${req.files[k][0]?.size} bytes, ${req.files[k][0]?.mimetype})`)
            : "none"
        );

        const { title, artist } = req.body;

        if (!title || !artist) {
            return res.status(400).json({ error: "Title and artist are required" });
        }

        // Validate audio file existence
        if (!req.files || !req.files.file || req.files.file.length === 0) {
            console.error("[uploadSong] No audio file found in request");
            return res.status(400).json({
                error: "Please upload an audio file",
                debug: {
                    filesReceived: req.files ? Object.keys(req.files) : [],
                    contentType: req.headers['content-type']
                }
            });
        }

        const audioFile = req.files.file[0];
        const imageFile = req.files.coverImage ? req.files.coverImage[0] : null;

        console.log(`[uploadSong] Audio: ${audioFile.originalname}, size: ${audioFile.buffer?.length} bytes`);
        if (imageFile) console.log(`[uploadSong] Image: ${imageFile.originalname}, size: ${imageFile.buffer?.length} bytes`);

        // Validate buffer exists (memory storage guard)
        if (!audioFile.buffer || audioFile.buffer.length === 0) {
            return res.status(400).json({ error: "Audio file buffer is empty. Upload may have failed." });
        }

        // Check for existing song
        const alreadyexist = await SongModel.findOne({ title, artist });
        if (alreadyexist) {
            return res.status(400).json({ message: "This song is already uploaded!" });
        }

        // Upload to Cloudinary in parallel
        console.log("[uploadSong] Starting Cloudinary uploads...");
        const audioUploadPromise = uploadToCloudinary(audioFile.buffer);

        let imageUploadPromise = Promise.resolve(null);
        if (imageFile && imageFile.buffer && imageFile.buffer.length > 0) {
            imageUploadPromise = uploadImageToCloudinary(imageFile.buffer);
        }

        const [audioUrl, imageUrl] = await Promise.all([audioUploadPromise, imageUploadPromise]);

        if (!audioUrl) {
            console.error("[uploadSong] Cloudinary audio upload returned no URL");
            return res.status(500).json({ error: "Audio upload to Cloudinary failed — no URL returned" });
        }

        console.log("[uploadSong] Audio URL:", audioUrl);
        console.log("[uploadSong] Image URL:", imageUrl);

        const song = await SongModel.create({
            title,
            artist,
            filepath: audioUrl,
            coverImage: imageUrl || null
        });

        console.log("[uploadSong] Song saved to DB:", song._id);
        res.status(201).json({ message: "Song uploaded successfully!", song });

    } catch (error) {
        console.error("[uploadSong] CRITICAL ERROR:", error.message);
        console.error("[uploadSong] Stack:", error.stack);
        res.status(500).json({
            error: "Internal server error during song upload",
            details: error.message,
            type: error.name || "UnknownError"
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