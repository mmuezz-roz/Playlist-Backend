import { PlayListModel } from "../Models/Playlist.js";
import { UserModel } from "../Models/User.js";


export const NewPlaylist = async (req, res) => {
    try {
        const { title, owner } = req.body;
        // Use req.userId if available (from Verifytoken), otherwise fallback to body.owner
        const playlistOwner = req.userId || owner;

        if (!title) {
            return res.status(400).json({ message: "Playlist title is required" });
        }

        const addplaylist = await PlayListModel.create({ title, owner: playlistOwner })
        res.status(201).send({ message: "Playlist added successfully!!", data: addplaylist })

    } catch (error) {
        console.log(error);
        res.status(500).send("Playlist Not added!!")
    }
}

export const Getplaylist = async (req, res) => {
    try {
        const getplaylist = await PlayListModel.find({ owner: req.userId })
        res.status(200).send({ message: "GOT PLAYLIST", playListData: getplaylist })

    } catch (error) {
        console.log(error);
        res.status(500).send("No Playlist!!")
    }
}

export const getPlaylistById = async (req, res) => {
    try {
        const { id } = req.params;
        const getbyId = await PlayListModel.findById(id).populate('songs')

        if (!getbyId) {
            return res.status(404).json({ message: "Playlist not found" });
        }

        res.status(200).send({ message: "Found Playlist", data: getbyId })

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal server error" })
    }
}

export const findandupdate = async (req, res) => {
    try {
        const { playlistId, songId } = req.params;

        const playlistexist = await PlayListModel.findById(playlistId)
        if (!playlistexist) {
            return res.status(404).send({ message: "Playlist Not Found" })
        }

        // Avoid duplicates in playlist
        if (playlistexist.songs.includes(songId)) {
            return res.status(400).json({ message: "Song already in playlist" });
        }

        const fndupdation = await PlayListModel.findByIdAndUpdate(playlistId, { $push: { songs: songId } }, { new: true })
        res.status(200).json({ message: "Song added successfully!!", data: fndupdation })

    } catch (error) {
        console.log(error);
        res.status(500).send("error occured!!")
    }
}

export const findandremove = async (req, res) => {
    try {
        const { playlistId, songId } = req.params;
        const fnddeletion = await PlayListModel.findByIdAndUpdate(playlistId, { $pull: { songs: songId } }, { new: true })

        if (!fnddeletion) {
            return res.status(404).json({ message: "Playlist not found" });
        }

        res.status(200).json({ message: "Song removed successfully!!", data: fnddeletion })

    } catch (error) {
        console.log(error);
        res.status(500).send("error occured!!")
    }
}

export const DeletePLaylist = async (req, res) => {
    try {
        const { id } = req.params;
        const dltbyId = await PlayListModel.findByIdAndDelete(id)

        if (!dltbyId) {
            return res.status(404).json({ message: "Playlist not found" });
        }

        res.status(200).send({ message: "Deleted Playlist Successfully!!", data: dltbyId })

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal server error" })
    }
}