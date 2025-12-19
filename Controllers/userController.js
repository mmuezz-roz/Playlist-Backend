import { UserModel } from "../Models/User.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


export const registerUser = async(req,res)=>{
    try {

        // find by email
        
        // if return alredy exist
        const { name, email, password } = req.body;
        const existing = await UserModel.findOne({email})
      
        console.log("hgfyud",existing);

        if(existing){
            res.status(201).send({message:"email already existed!!"})
        }

        const hashed = await bcrypt.hash(password, 10);

        const newUser = await UserModel.create({name,email,password:hashed})

          const token = jwt.sign(
            { id: newUser._id , email: email }, process.env.JWT_SECRET,
            {expiresIn:"1d"}

        );console.log("token is creeaaaa",token);
        

         res.status(201).send({message:"Successfully registered!",data:newUser})

    } catch (error) {
        console.log(error);
        res(404).send("Registration Failedd!!!")
        
    }
}

export const userLogin = async (req,res)=>{
    try {
        const {email,password} = req.body;
        const loginedUser = await UserModel.findOne({email})
        console.log(loginedUser);
        if(!loginedUser){
           return res.status(404).json("Not Found !!")
        }
        const match = await bcrypt.compare(password,loginedUser.password)
        if(!match){
            res.status(404).send({message:"password is incorrect!! "})
        }
        const token = jwt.sign({
            id:loginedUser._id, email:loginedUser.email
        },process.env.JWT_SECRET,{expiresIn: "1d"})
        
        res.status(200).send({message:"logined successfully!!",token:token,user:loginedUser})
        
    } catch
     (error) {
        console.log(error);
        re.status(500).send("login failedd!!")
        
    }
}