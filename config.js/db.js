import mongoose from "mongoose";

export default async function connectDB() {
    try {
        await mongoose.connect(process.env.musicPlayList_URL)
        console.log("DB Is connected!");

    } catch (error) {
        console.log("DB Not connected", error);

    }
}