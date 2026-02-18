import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import connectDB from './config/db.js'
import UserRoute from './Route/UserRoute.js'
import songRoute from './Route/songRoute.js'
import PlaylistRoute from './Route/playlistRoute.js'

const app = express()

const ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "https://melodyhub-frontend.vercel.app"
];

// ✅ CORS — manually set headers on EVERY response (most reliable on Vercel)
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    // Immediately respond to preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    next();
});

app.use(express.json())

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Backend is active' });
});

// DB connection middleware — ensures DB is connected on every serverless cold start
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("DB connection failed:", error.message);
        res.status(500).json({ message: "Database connection failed", error: error.message });
    }
});

// API Routes
app.use('/', UserRoute)
app.use('/', songRoute)
app.use('/playlists', PlaylistRoute)

// Fallback for undefined routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// For local development only
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Local server started on port ${PORT}`);
    });
}

export default app;
