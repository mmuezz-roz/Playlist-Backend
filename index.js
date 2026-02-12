import dotenv from 'dotenv';
dotenv.config();

// --- CRITICAL DEPLOYMENT SAFETY CHECK ---
// This MUST run before any other imports to prevent the Cloudinary SDK from crashing the app.
if (process.env.CLOUDINARY_URL && !process.env.CLOUDINARY_URL.startsWith("cloudinary://")) {
    process.env.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_URL;
    delete process.env.CLOUDINARY_URL;
    console.log("🛠️  Bypassed malformed CLOUDINARY_URL");
}

import express from 'express'
import cors from 'cors'
import UserRoute from './Route/UserRoute.js'
import songRoute from './Route/songRoute.js'
import PlaylistRoute from './Route/playlistRoute.js'
import connectDB from './config.js/db.js'

const app = express()
app.use(express.json())
app.use(cors())

// Routes
app.use('/', UserRoute, songRoute)
app.use('/playlists', PlaylistRoute)

// Health Check (So Render knows the app is alive)
app.get('/health', (req, res) => res.status(200).send('OK'))

const start = async () => {
    try {
        await connectDB()
        const PORT = process.env.PORT || 3000
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`✅ Server running on port ${PORT}`);
        })
    } catch (error) {
        console.error("❌ Fatal Error during startup:", error);
    }
}

start()