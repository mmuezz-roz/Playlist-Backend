import mongoose from "mongoose";

export default async function connectDB() {
    if (!process.env.musicPlayList_URL) {
        console.error("FATAL ERROR: musicPlayList_URL is not defined in environment variables.");
        return;
    }
    try {
        await mongoose.connect(process.env.musicPlayList_URL)
        console.log("DB Is connected!");

    } catch (error) {
        console.log("DB Not connected", error);

    }
}