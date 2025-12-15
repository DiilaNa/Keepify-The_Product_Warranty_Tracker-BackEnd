import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import cloudinary from "../../config/cloudinary";
import { Announcement, AnnouncementStatus } from "../../model/Announcements";
import { Category } from "../../model/Category";

export const save_announcement = async(req:AuthRequest,res:Response) => {
    try{
        if(!req.user){
            return res.status(401).json({message:"Unauthorized"})
        }

        const { title, description, category } = req.body;
        let imageURl = "";

        if(req.file){
            const result: any = await new Promise((resolve,reject)=>{
                const uploadt_stream = cloudinary.uploader.upload_stream(
                    {folder:"announcements"},
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

        const categoryDoc = await Category.findById(category);
            if (!categoryDoc) {
                return res.status(400).json({ message: "Invalid category selected" });
            }

        const newAnnouncement = new Announcement({
          title,
          description,
          status: AnnouncementStatus.PUBLISHED,
          img_url: imageURl,
          ownerId: req.user.sub,
          category: categoryDoc._id,
        });

        await newAnnouncement.save();

        res.status(201).json({
            message:"Announcement Posted successfully",
            data: newAnnouncement
        })

    }catch(error:any){
        res.status(500).json({message:"Error saving announcement",error: error?.message})
    }
}

