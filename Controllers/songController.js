import { SongModel } from "../Models/song.js";
import cloudinary, { uploadToCloudinary } from "../config/cloudinary.js";


export const uploadSong = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "please upload an MP3 file" })
        }

        const { title, artist } = req.body;

        if (!title || !artist) {
            return res.status(400).json({ error: "Title and artist are required" });
        }

        const alreadyexist = await SongModel.findOne({ title, artist });
        if (alreadyexist) {
            return res.status(400).json({ message: "This song is already uploaded!" });
        }

        const cloudinaryUrl = await uploadToCloudinary(req.file.buffer);

        if (!cloudinaryUrl) {
            return res.status(500).json({ error: "cloudinary upload failed!!" })
        }

        const song = await SongModel.create({
            title,
            artist,
            filepath: cloudinaryUrl,
        });

        res.status(201).send({ message: "file uploaded successfully!!", song })

    } catch (error) {
        console.error("SONG_UPLOAD_ERROR_DETAILS:", error);
        if (error.response) console.error("Cloudinary Response Error:", error.response);
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