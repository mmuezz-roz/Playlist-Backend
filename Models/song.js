import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    filepath: {
        type: String,
        required: false
    },
    coverImage: {
        type: String,
        required: false,
        default: null
    }
}, { timestamps: true })

export const SongModel = mongoose.model('song', songSchema)