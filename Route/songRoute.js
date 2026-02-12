import express from 'express'
import { getAllsongs, getAsong, uploadSong } from '../Controllers/songController.js';
import upload from '../middleware/multer.js'
import Verifytoken from '../middleware/varifyToken.js';

const songRoute = express.Router()

songRoute.use((req,res,next)=> {
    console.log("SongRouter Level Middleware");
    next()
})

songRoute.post("/addSong", upload.single("file"),Verifytoken,uploadSong )
songRoute.get("/getsongs", getAllsongs)
songRoute.get("/getOneSong/:id", getAsong)


export default songRoute