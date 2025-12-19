import express from 'express'
import { registerUser, userLogin } from '../Controllers/userController.js';

const UserRoute = express.Router()
UserRoute.use((Req,res,next)=>{
    console.log("Router Level Middleware");
    next()
})

UserRoute.post('/register', registerUser)
UserRoute.post('/login', userLogin)


export default UserRoute