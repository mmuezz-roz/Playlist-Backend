import express from 'express'
import UserRoute from './Route/UserRoute.js'
import connectDB from './config.js/db.js'
import dotenv from 'dotenv'
import songRoute from './Route/songRoute.js'
import cors from 'cors'
import PlaylistRoute from './Route/playlistRoute.js'
dotenv.config()


const app = express()
app.use(express.json())
app.use(cors());

app.use('/', UserRoute , songRoute )
app.use('/playlists',PlaylistRoute)


connectDB()

app.listen(3000 , ()=> {console.log("server Started !!");
})