import mongoose from "mongoose";

export default async function connectDB() {
    const url = process.env.musicPlayList_URL;

    if (!url || url.includes("127.0.0.1") || url.includes("localhost")) {
        console.error("❌ ERROR: You are trying to connect to a Local MongoDB on Render.");
        console.error("👉 FIX: Update 'musicPlayList_URL' in Render Environment settings to a MongoDB Atlas string.");
        return; // Don't throw, just log so the server stays alive
    }

    try {
        await mongoose.connect(url);
        console.log("💎 MongoDB Atlas Connected!");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
    }
}