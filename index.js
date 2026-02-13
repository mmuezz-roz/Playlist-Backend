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

// CORS configuration - Move to top
app.use(cors({
    origin: ["http://localhost:5173", "https://melodyhub-frontend.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
}));

// Explicitly handle preflight requests
app.options('*', cors());

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