import dotenv from "dotenv"
import { Request, Response } from "express"
import { Role, Status, User } from "../model/User";
import bcrypt from "bcryptjs"

dotenv.config()

export const register = async(req:Request,res:Response) =>{
    try{
        const {firstname,lastname,email,password,role} = req.body;
        
        if (!firstname || !lastname || !email || !password || !role) {
                return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (role !== Role.USER) {
            return res.status(400).json({ message: "Invalid data: Cannot register as ADMIN" });
        }   
    
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            role: Role.USER,
            approved: Status.ACTIVE
        })

        await newUser.save();

        res.status(201).json({
            message:"User Registered Successfully",
            data:{
                id: newUser._id,
                email: newUser.email,
                role: newUser.role,
                approved: newUser.approved
            }
        })

    }catch(err:any){
        console.error(err)
        res.status(500).json({message:err?.message})
    }
}