import mongoose from "mongoose";

const playListSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    songs:
     [{ type: mongoose.Schema.Types.ObjectId, ref: "song" }],

     owner: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
     
       createdAt: {
        type: Date,
        default: Date.now
    }
})

export const PlayListModel = mongoose.model("playlist",playListSchema)