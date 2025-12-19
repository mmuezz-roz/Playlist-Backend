import express from 'express'
import { getAllsongs, getAsong, uploadSong } from '../Controllers/songController.js';
import upload from '../middleware/multer.js'

const songRoute = express.Router()

songRoute.use((req,res,next)=> {
    console.log("SongRouter Level Middleware");
    next()
})

songRoute.post("/addSong", upload.single("file"),uploadSong )
songRoute.get("/getsongs", getAllsongs)
songRoute.get("/getOneSong/:id", getAsong)


export default songRoute