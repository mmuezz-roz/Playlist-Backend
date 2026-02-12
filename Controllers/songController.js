// import { log } from "console";
import { SongModel } from "../Models/song.js";
import cloudinary, { uploadToCloudinary } from "../config.js/cloudinary.js";
// import streamifier from 'streamifier' 

export const uploadSong = async(req,res)=>{
    try {
        
        if(!req.file){
            return res.status(400).json({error:"please upload an MP3 file"})
        }

        const {title,artist,filepath} = req.body;

        const alreadyexist = await SongModel.findOne({title,artist,filepath});

        if(alreadyexist){
            return res.status(400).json({message:"This song is already uploaded!",song:alreadyexist});
        }


       
        console.log("hayyy",req.file);

        const cloudinaryUrl = await uploadToCloudinary(req.file.buffer);
        

        if(!cloudinaryUrl){
            return res.status(500).json({error:"cloudinary upload failed!!"})
        }

        const song = await SongModel.create({
            title: req.body.title,
            artist: req.body.artist,
            filepath: cloudinaryUrl,
        });

        res.status(201).send({message:"file uploaded succesfully!!", song})


    } catch (error) {
        console.log(error);
        res.status(404).send("song doesn`t added !!")
           
    }
//     const authMiddleware = (req, res, next) => {
//     const token = req.headers.authorization?.split(" ")[1];

//     if (!token) {
//         return res.status(401).json({ message: "Unauthorized" });
//     }

//     // verify JWT here
//     next();
// };

}



export const getAllsongs = async(req,res)=>{
    try {
         
        const getsong = await SongModel.find()
        console.log(getsong);
        res.status(201).send({message:"Found Songs!!", data:getsong})
        

    } catch (error) {
        console.log(error);
        
    }
}

export const getAsong = async(req,res)=>{
    try {
        const {id} = req.params;
        const getSong = await SongModel.findById(id);
        console.log(getSong);
         res.status(201).send({message:"Found A Song!!", data:getSong})
        

    } catch (error) {
       console.log(error);
       res.status(404).send("didn't get a song!")
        
    }
}