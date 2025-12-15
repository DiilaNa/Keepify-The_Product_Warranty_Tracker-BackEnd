import { Response } from "express";
import { Announcement, AnnouncementStatus} from "../model/Announcements";
import { AuthRequest } from "../middleware/auth";
import cloudinary from "../config/cloudinary";
import { Category } from "../model/Category";

export const loadAdminAnnouncements = async(req: AuthRequest, res: Response) => {
    try{
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const posts = await Announcement.find()
        .populate("category","name")
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit);

        const total = await Announcement.countDocuments();
        const totalPages = Math.ceil(total / limit);
        
        res.status(200).json({
            message:"Announcements fetched successfully in welcome page (admin)",
            data:posts,
            page,
            totalPages,
            totalAnnouncements: total
        })
    }catch(error:any){
        res.status(500).json({
            message:"Error in Fetching announcements in welcome page (admin)",
            error: error?.message
        })
    }
}

export const editAnnouncements = async(req: AuthRequest, res: Response) => {
    try{
        const announcementId = req.params.id;

        const existing = await Announcement.findById(announcementId);

        if (!existing) {
            return res.status(404).json({ message: "Announcement not found" });
        }

        const { title, content, status, category } = req.body;

        const categoryDoc = await Category.findOne({ name: category });

        if (!categoryDoc) {
            return res.status(400).json({ 
                message: "Invalid category selected" 
            });
        }

        let imageURL = existing.img_url;

        if (req.file) {
            const result: any = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "announcements" },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
                uploadStream.end(req.file?.buffer);
            });

            imageURL = result.secure_url;
        }

        existing.title = title ?? existing.title;
        existing.description = content ?? existing.description;
        existing.status = status ?? existing.status;
        existing.category = categoryDoc._id ?? existing.category;
        existing.img_url = imageURL;

        await existing.save();

        res.status(200).json({
            message:"Editing announcement successfull",
            data:existing
        })

    }catch(error:any){
        res.status(500).json({
            message: "Error in editing announcement",
            error: error?.message
        })
    }
}    

export const updateAnnouncementStatus = async (req: AuthRequest, res: Response) => {
     try {
        const announcementId = req.params.id;

        const existing = await Announcement.findById(announcementId);
        if (!existing) {
            return res.status(404).json({
                message: "Announcement not found"
            });
        }

        const newStatus = existing.status === AnnouncementStatus.PUBLISHED ? AnnouncementStatus.UNPUBLISHED : AnnouncementStatus.PUBLISHED;

        existing.status = newStatus;
        await existing.save();

        res.status(200).json({
            message: `Announcement is now ${newStatus}`,
            data: existing
        });

    } catch (error: any) {
        res.status(500).json({
            message: "Error toggling announcement status",
            error: error.message
        });
    }
};
