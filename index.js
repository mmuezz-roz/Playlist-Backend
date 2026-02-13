import dotenv from 'dotenv'
dotenv.config()

// Prevent Cloudinary SDK crash on Render if CLOUDINARY_URL is invalid
if (process.env.CLOUDINARY_URL && !process.env.CLOUDINARY_URL.startsWith('cloudinary://')) {
    delete process.env.CLOUDINARY_URL;
}

import express from 'express'
import UserRoute from './Route/UserRoute.js'
import connectDB from './config.js/db.js'
import songRoute from './Route/songRoute.js'
import cors from 'cors'
import PlaylistRoute from './Route/playlistRoute.js'


const app = express()

// Manual CORS middleware for Vercel
app.use((req, res, next) => {
    const allowedOrigins = [
        "http://localhost:5173",
        "https://melodyhub-frontend.vercel.app",
        "https://melodyhub-frontend.vercel.app/"
    ];
    const origin = req.headers.origin;

    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    } else if (!origin) {
        // Fallback for tools or non-browser requests if needed, 
        // but browser preflights ALWAYS have an origin.
        res.setHeader("Access-Control-Allow-Origin", "https://melodyhub-frontend.vercel.app");
    }

    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    // Handle Preflight
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    next();
});

app.use(express.json())

// Health check route
app.get('/health', (req, res) => res.json({ status: 'ok' }))

app.use('/', UserRoute)
app.use('/', songRoute)
app.use('/playlists', PlaylistRoute)

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("GLOBAL_ERROR:", err);
    res.status(err.status || 500).json({
        message: err.message || "Something went wrong on the server",
        error: process.env.NODE_ENV === "production" ? {} : err
    });
});

connectDB()

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server Started on port ${PORT} !!`);
})