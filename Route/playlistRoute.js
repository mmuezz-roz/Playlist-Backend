import express from 'express'
import { DeletePLaylist, findandremove, findandupdate, Getplaylist, getPlaylistById, NewPlaylist } from '../Controllers/playlistController.js';
import Verifytoken from '../middleware/varifyToken.js';

const PlaylistRoute = express.Router()

PlaylistRoute.use((req,res,next)=> {
    console.log("SongRouter Level Middleware");
    next()
})
console.log("✅ PlaylistRoute loaded");


PlaylistRoute.post("/Playlist",Verifytoken ,NewPlaylist)
PlaylistRoute.get("/getAllPlaylist",Verifytoken ,Getplaylist)
PlaylistRoute.get("/getplaylistbyId/:id",Verifytoken, getPlaylistById)
PlaylistRoute.put("/:playlistId/add-song/:songId",Verifytoken,findandupdate)
PlaylistRoute.put("/:playlistId/remove-song/:songId",Verifytoken,findandremove)
PlaylistRoute.delete("/DeleteAplaylist/:id",Verifytoken,DeletePLaylist)

export default PlaylistRoute