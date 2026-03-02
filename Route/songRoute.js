import express from 'express'
import { getAllsongs, getAsong, uploadSong } from '../Controllers/songController.js';
import upload from '../middleware/multer.js'
import Verifytoken from '../middleware/varifyToken.js';

const songRoute = express.Router()

// Multer error handler wrapper
const multerUpload = upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
]);

const handleMulterUpload = (req, res, next) => {
    multerUpload(req, res, (err) => {
        if (err) {
            console.error('[SongRoute] Multer error:', err.message, err.code || '');
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(413).json({ error: 'File too large. Maximum size is 50MB.' });
            }
            if (err.code === 'LIMIT_FILE_COUNT') {
                return res.status(400).json({ error: 'Too many files uploaded.' });
            }
            return res.status(400).json({ error: err.message || 'File upload error' });
        }
        next();
    });
};

songRoute.post("/addSong", handleMulterUpload, Verifytoken, uploadSong)
songRoute.get("/getsongs", getAllsongs)
songRoute.get("/getOneSong/:id", getAsong)

export default songRoute