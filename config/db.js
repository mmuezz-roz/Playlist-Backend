import mongoose from "mongoose";

// Cache the connection across serverless invocations
let isConnected = false;

export default async function connectDB() {
    if (isConnected) {
        console.log("Using existing DB connection");
        return;
    }

    if (!process.env.musicPlayList_URL) {
        console.error("FATAL ERROR: musicPlayList_URL is not defined in environment variables!");
        throw new Error("musicPlayList_URL is not defined");
    }

    try {
        const db = await mongoose.connect(process.env.musicPlayList_URL, {
            serverSelectionTimeoutMS: 10000, // 10 second timeout
            socketTimeoutMS: 45000,
        });
        isConnected = db.connections[0].readyState === 1;
        console.log("DB Is connected successfully!");
    } catch (error) {
        console.error("DB Connection Error:", error.message);
        throw error; // Re-throw so the app knows DB failed
    }
}