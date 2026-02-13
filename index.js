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
app.use(express.json())
app.use(cors({
    origin: ["http://localhost:5173", "https://melodyhub-frontend.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use('/', UserRoute, songRoute)
app.use('/playlists', PlaylistRoute)


connectDB()

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server Started on port ${PORT} !!`);
})