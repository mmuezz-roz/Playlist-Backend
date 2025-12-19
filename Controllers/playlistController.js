import { PlayListModel } from "../Models/Playlist.js";
import { UserModel } from "../Models/User.js";


export const NewPlaylist = async(req,res)=>{
    try {
        const addplaylist = await PlayListModel.create({title:req.body.title,owner:req.body.owner})
        console.log(addplaylist);
        res.status(201).send({message:"Playlist added succesfully!!", data:addplaylist})
        
    } catch (error) {
        console.log(error);
        res.status(404).send("Playlist Not added!!")
    }
}

export const Getplaylist = async(req,res)=>{
    try {
        console.log("hyy");

        
        const getplaylist = await PlayListModel.find({owner:req.userId})
        console.log(getplaylist);

        res.status(201).send({message:"GOT PLAYLIST", playListData:getplaylist})
        
    } catch (error) {
        console.log(error);
        res.status(404).send("No Playlist!!")
    }
}

export const getPlaylistById = async(req,res)=>{
    try {
        const {id} = req.params;
        const getbyId = await PlayListModel.findById(id).populate('songs')
        console.log(getbyId);
        res.status(201).send({message:"Found Playlist",data:getbyId})
        

    } catch (error) {
        console.log(error);
         res.status(404).send({message:"Not Found Any Playlisttt!!"})
    }
}

export const findandupdate = async(req,res)=>{
    try {
        const {playlistId,songId} = req.params;

        const playlistexist = await PlayListModel.findById(playlistId)
        if(!playlistexist){
          return res.status(404).send({message:"Playlist Not Found"})
        }

        const fndupdation = await PlayListModel.findByIdAndUpdate(playlistId,{$push: {songs:songId}},{new:true})
        console.log(fndupdation);
        res.status(201).json({message:"Song added successfully!!",data:fndupdation})
        
    } catch (error) {
        console.log(error);
        res.status(404).send("error occured!!")
        
    }
}

export const findandremove = async(req,res)=>{
    try {
        
        const {playlistId,songId} = req.params;
        console.log("PARAMS 👉", req.params);
        const fnddeletion = await PlayListModel.findByIdAndUpdate(playlistId,{$pull: {songs:songId}},{new:true})
        console.log("working ann ttoo",fnddeletion);
        
        res.status(201).json({message:"Song deleted successfully!!",data:fnddeletion})
        
    } catch (error) {
        console.log(error);
        res.status(404).send("error occured!!")
        
    }
}

export const DeletePLaylist = async(req,res)=>{
    try {
        const {id} = req.params;
        const dltbyId = await PlayListModel.findByIdAndDelete(id)
        console.log(dltbyId);
        res.status(201).send({message:"Deleted PlayLIst Successfully!!",data:dltbyId})
        

    } catch (error) {
        console.log(error);
         res.status(404).send({message:"Not Found Any Playlisttt!!"})
    }
}