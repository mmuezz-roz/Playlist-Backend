import { SongModel } from "../Models/song.js";
import cloudinary, { uploadToCloudinary } from "../config.js/cloudinary.js";


export const uploadSong = async (req, res) => {
    try {
        console.log("Upload request received:", { title: req.body.title, artist: req.body.artist, file: req.file ? req.file.originalname : "none" });

        if (!req.file) {
            console.log("No file provided in request");
            return res.status(400).json({ error: "please upload an MP3 file" })
        }

        const { title, artist } = req.body;

        if (!title || !artist) {
            console.log("Missing fields:", { title, artist });
            return res.status(400).json({ error: "Title and artist are required" });
        }

        // Check DB connection status
        if (SongModel.db.readyState !== 1) {
            console.error("Database not ready. Current state:", SongModel.db.readyState);
            return res.status(503).json({ error: "Database connection not ready. Please try again in 30 seconds." });
        }

        const alreadyexist = await SongModel.findOne({ title, artist });
        if (alreadyexist) {
            console.log("Song already exists:", { title, artist });
            return res.status(400).json({ message: "This song is already uploaded!" });
        }

        console.log("Uploading to Cloudinary...");
        const cloudinaryUrl = await uploadToCloudinary(req.file.buffer);

        if (!cloudinaryUrl) {
            console.error("Cloudinary upload returned null URL");
            return res.status(500).json({ error: "cloudinary upload failed!!" })
        }

        console.log("Creating DB record with URL:", cloudinaryUrl);
        const song = await SongModel.create({
            title,
            artist,
            filepath: cloudinaryUrl,
        });

        console.log("Upload successful:", song._id);
        res.status(201).send({ message: "file uploaded successfully!!", song })

    } catch (error) {
        console.error("CRITICAL ERROR DURING SONG UPLOAD:", error);
        res.status(500).json({
            message: "Internal server error during song upload",
            error: error.message,
            cloudinaryError: error.http_code ? `Cloudinary error: ${error.http_code}` : null,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        })
    }
}

export const getAllsongs = async (req, res) => {
    try {
        const getsong = await SongModel.find()
        res.status(200).send({ message: "Found Songs!!", data: getsong })

    } catch (error) {
        console.log(error);
        res.status(500).send("Failed to retrieve songs")
    }
}

export const getAsong = async (req, res) => {
    try {
        const { id } = req.params;
        const getSong = await SongModel.findById(id);

        if (!getSong) {
            return res.status(404).send({ message: "Song not found" });
        }

        res.status(200).send({ message: "Found A Song!!", data: getSong })

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error")
    }
}