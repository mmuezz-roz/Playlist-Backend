import dotenv from 'dotenv'
dotenv.config()

// --- SAFETY CHECK FOR DEPLOYMENT (RENDER/VERCEL) ---
// 1. Cloudinary Fix: Prevent crash if CLOUDINARY_URL is just a string (not its protocol)
if (process.env.CLOUDINARY_URL && !process.env.CLOUDINARY_URL.startsWith("cloudinary://")) {
    console.log("🛠️  Cleaning malformed CLOUDINARY_URL for production...");
    delete process.env.CLOUDINARY_URL;
}

// 2. Database Warning: Catch if pointing to localhost on Render
if (process.env.NODE_ENV === "production" && process.env.musicPlayList_URL?.includes("127.0.0.1")) {
    console.error("❌ ERROR: Production backend is pointing to Local MongoDB (127.0.0.1). Use MongoDB Atlas!");
}
// --------------------------------------------------

import express from 'express'
import UserRoute from './Route/UserRoute.js'
import connectDB from './config.js/db.js'
import songRoute from './Route/songRoute.js'
import cors from 'cors'
import PlaylistRoute from './Route/playlistRoute.js'


const app = express()
app.use(express.json())
app.use(cors());

app.use('/', UserRoute, songRoute)
app.use('/playlists', PlaylistRoute)


connectDB()

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server Started on port ${PORT} !!`);
})