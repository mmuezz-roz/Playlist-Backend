import dotenv from 'dotenv'
dotenv.config()

// Prevent Cloudinary SDK crash on Render/Vercel if CLOUDINARY_URL is invalid
if (process.env.CLOUDINARY_URL && !process.env.CLOUDINARY_URL.startsWith('cloudinary://')) {
    delete process.env.CLOUDINARY_URL;
}

import express from 'express'
import UserRoute from './Route/UserRoute.js'
import connectDB from './config/db.js'
import songRoute from './Route/songRoute.js'
import cors from 'cors'
import PlaylistRoute from './Route/playlistRoute.js'

const app = express()

// 1. CORS Configuration (Must be at the top)
app.use(cors({
    origin: ["http://localhost:5173", "https://melodyhub-frontend.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true
}));

app.use(express.json())

// 2. Health check route (Top level for quick verification)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Backend is up and running' });
});

// 3. API Routes
app.use('/', UserRoute)
app.use('/', songRoute)
app.use('/playlists', PlaylistRoute)

// 4. Global Error Handler
app.use((err, req, res, next) => {
    console.error("GLOBAL_ERROR:", err);
    res.status(err.status || 500).json({
        message: err.message || "Something went wrong on the server",
        error: process.env.NODE_ENV === "production" ? {} : err
    });
});

// 5. Catch-all for undefined routes
app.use('*', (req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// 6. DB Connection
connectDB().catch(err => {
    console.error("Delayed DB Connection Error:", err);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server Started on port ${PORT} !!`);
})

export default app;
