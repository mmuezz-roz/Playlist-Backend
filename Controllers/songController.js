import { SongModel } from "../Models/song.js";
import cloudinary, { uploadToCloudinary, uploadImageToCloudinary } from "../config/cloudinary.js";


export const uploadSong = async (req, res) => {
    try {
        const { title, artist } = req.body;

        if (!title || !artist) {
            return res.status(400).json({ error: "Title and artist are required" });
        }

        // Check if audio file exists
        if (!req.files || !req.files.file || req.files.file.length === 0) {
            return res.status(400).json({ error: "Please upload an audio file" });
        }

        const audioFile = req.files.file[0];
        const imageFile = req.files.coverImage ? req.files.coverImage[0] : null;

        const alreadyexist = await SongModel.findOne({ title, artist });
        if (alreadyexist) {
            return res.status(400).json({ message: "This song is already uploaded!" });
        }

        // Start uploads
        console.log("Uploading audio...");
        const audioUploadPromise = uploadToCloudinary(audioFile.buffer);

        let imageUploadPromise = Promise.resolve(null);
        if (imageFile) {
            console.log("Uploading cover image...");
            imageUploadPromise = uploadImageToCloudinary(imageFile.buffer);
        }

        // Wait for both
        const [audioUrl, imageUrl] = await Promise.all([audioUploadPromise, imageUploadPromise]);

        if (!audioUrl) {
            return res.status(500).json({ error: "Audio upload failed" });
        }

        const song = await SongModel.create({
            title,
            artist,
            filepath: audioUrl,
            coverImage: imageUrl
        });

        res.status(201).send({ message: "Song uploaded successfully!", song });

    } catch (error) {
        console.error("SONG_UPLOAD_ERROR_DETAILS:", error);
        res.status(500).send({
            error: "Internal server error during song upload",
            details: error.message
        });
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