import dotenv from "dotenv"
import { Request, Response } from "express"
import { Role, Status, User } from "../model/User";
import bcrypt from "bcryptjs"
import { signAccessToken, signRefreshToken } from "../utils/token";
import jwt from "jsonwebtoken"
import { AuthRequest } from "../middleware/auth";

dotenv.config()

const JWT_REFRESH = process.env.JWT_REFRESH as string

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

export const login = async(req: Request,res:Response) =>{
    try{
        const {email, password} = req.body;

        const existingUser = await User.findOne({email})
        
        if(!existingUser){
            return res.status(401).json({message:"Invalid credentials"})
        }

        const valid = await bcrypt.compare(password,existingUser.password)

        if(!valid){
            return res.status(401).json({message:"Invalid credentials"})
        }

        const accessToken = signAccessToken(existingUser)
        const refreshToken = signRefreshToken(existingUser)

        res.status(200).json({
            message: "success",
            data:{
                email: existingUser.email,
                roles: existingUser.role,
                accessToken,
                refreshToken
            }
        })

    }catch(error:any){
        res.status(500).json({
            message: error?.message
        })
    }

}

export const handleRefreshToken = async(req:Request,res:Response) => {
    try{
        const{token} = req.body

        if(!token){
            return res.status(400).json({message:"Token Expired"})
        }

        const payload = jwt.verify(token,JWT_REFRESH)
        const user = await User.findById(payload.sub)

        if(!user){
            return res.status(403).json({message:"Invalid Refresh Token"})
        }

        const accessToken = signAccessToken(user)
        res.status(200).json({accessToken})

    }catch(err:any){
        res.status(403).json({message:"Invalid or Expired Token"})
    }
}

export const adminRegister = async(req:AuthRequest,res:Response) => {
    try{
        const {firstname,lastname,email,password} = req.body;

        if(!firstname || !lastname || !email || !password){
            return res.status(400).json({message: "All fields are required"})
        }

        const existingUser = await User.findOne({email})
        
        if(existingUser){
            return res.status(400).json({message:"Email Already registered"})
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new User({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            role: Role.ADMIN,
            approved: Status.ACTIVE
        })

        await newAdmin.save();

        res.status(201).json({
            message: "Admin created successfully",
            data: {
                id: newAdmin._id,
                firstname: newAdmin.firstname,
                lastname: newAdmin.lastname,
                email: newAdmin.email,
                role: newAdmin.role,
                approved: newAdmin.approved
            }
        });
    }catch(err:any){
        res.status(500).json({message: "Server Error",error: err.message})
    }
}