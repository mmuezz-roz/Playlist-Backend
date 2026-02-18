import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import UserRoute from './Route/UserRoute.js'
import songRoute from './Route/songRoute.js'
import PlaylistRoute from './Route/playlistRoute.js'

const app = express()

// 1. CORS - Standard setup
app.use(cors({
    origin: ["http://localhost:5173", "https://melodyhub-frontend.vercel.app"],
    credentials: true
}));

app.use(express.json())

// 2. Health check (Very top)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Backend is active' });
});

// 3. DB connection middleware — ensures DB is connected on every serverless cold start
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("DB connection failed:", error.message);
        res.status(500).json({ message: "Database connection failed", error: error.message });
    }
});

// 4. API Routes
app.use('/', UserRoute)
app.use('/', songRoute)
app.use('/playlists', PlaylistRoute)

// 5. Fallback for undefined routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// 6. Global Error Handler
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
