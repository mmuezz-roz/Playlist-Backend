import { UserModel } from "../Models/User.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existing = await UserModel.findOne({ email })

        if (existing) {
            return res.status(400).send({ message: "email already existed!!" })
        }

        const hashed = await bcrypt.hash(password, 10);
        const newUser = await UserModel.create({ name, email, password: hashed })

        const token = jwt.sign(
            { id: newUser._id, email: email }, process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(201).send({ message: "Successfully registered!", data: newUser, token })

    } catch (error) {
        console.log(error);
        res.status(500).send("Registration Failed!!!")
    }
}

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const loginedUser = await UserModel.findOne({ email })

        if (!loginedUser) {
            return res.status(404).json({ message: "User not found!!" })
        }

        const match = await bcrypt.compare(password, loginedUser.password)
        if (!match) {
            return res.status(401).send({ message: "password is incorrect!!" })
        }

        const token = jwt.sign({
            id: loginedUser._id, email: loginedUser.email
        }, process.env.JWT_SECRET, { expiresIn: "1d" })

        res.status(200).send({ message: "logined successfully!!", token: token, user: loginedUser })

    } catch (error) {
        console.error("LOGIN_ERROR:", error);
        res.status(500).json({ message: "login failed!!", error: error.message })
    }
}