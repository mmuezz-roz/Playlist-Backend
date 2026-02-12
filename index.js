import './pre-init.js'
import express from 'express'
import UserRoute from './Route/UserRoute.js'
import connectDB from './config.js/db.js'
import songRoute from './Route/songRoute.js'
import cors from 'cors'
import PlaylistRoute from './Route/playlistRoute.js'


const app = express()
app.use(express.json())
app.use(cors());

app.use('/', UserRoute, songRoute)
app.use('/playlists', PlaylistRoute)


connectDB()

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server Started on port ${PORT} !!`);
})