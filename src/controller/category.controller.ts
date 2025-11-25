import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import cloudinary from "../config/cloudinary";
import { Category } from "../model/Category";

export const save_category =async(req:AuthRequest,res:Response) => {
    try{
        if(!req.user){
            return res.status(401).json({message:"Unauthorized"})
        }

        const {name} = req.body
        let imageURl = "";

        if(req.file){
            const result: any = await new Promise((resolve,reject)=>{
                const uploadt_stream = cloudinary.uploader.upload_stream(
                    {folder:"categories"},
                    (error,result)=>{
                        if(error){
                            return reject(error)
                        }
                        resolve(result)
                    }
                )
                uploadt_stream.end(req.file?.buffer)

            })
            imageURl = result.secure_url;
        }

        const newCategory = new Category({
            name,
            image_url: imageURl,
        })

        await newCategory.save();

        res.status(201).json({
            message:"Category Added successfully",
            data: newCategory
        })

    }catch(error:any){
        res.status(500).json({message:"Error saving category",error: error?.message})
    }
}  