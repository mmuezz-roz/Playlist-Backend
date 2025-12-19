import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    artist:{
        type:String,
        required:true
    },
    filepath:{
        type:String,
        required:false
    }
})

export const  SongModel = mongoose.model('song',songSchema)