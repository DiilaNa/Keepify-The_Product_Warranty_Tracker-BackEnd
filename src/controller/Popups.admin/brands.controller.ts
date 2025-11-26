import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import { Brand } from "../../model/Brand";
// import cloudinary from "../config/cloudinary";

export const save_brand =async(req:AuthRequest,res:Response) => {
    try{
        if(!req.user){
            return res.status(401).json({message:"Unauthorized"})
        }

        const {category , brand_name} = req.body
        // let imageURl = "";

        // if(req.file){
        //     const result: any = await new Promise((resolve,reject)=>{
        //         const uploadt_stream = cloudinary.uploader.upload_stream(
        //             {folder:"categories"},
        //             (error,result)=>{
        //                 if(error){
        //                     return reject(error)
        //                 }
        //                 resolve(result)
        //             }
        //         )
        //         uploadt_stream.end(req.file?.buffer)

        //     })
        //     imageURl = result.secure_url;
        // }

        const newBrand = new Brand({
            category,
            brand_name,
            // image_url: imageURl,
        })

        await newBrand.save();

        res.status(201).json({
            message:"Brand Added successfully",
            data: newBrand
        })

    }catch(error:any){
        res.status(500).json({message:"Error saving brand",error: error?.message})
    }
}  