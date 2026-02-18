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
    res.status(200).json({ status: 'ok', message: 'Backend is active (minimal)' });
});

// 3. API Routes (Fully restored)
app.use('/', UserRoute)
app.use('/', songRoute)
app.use('/playlists', PlaylistRoute)

// 4. Fallback for undefined routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// 5. Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// 6. DB Connection (Asynchronous)
connectDB();

// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Local server started on port ${PORT}`);
    });
}

export default app;
