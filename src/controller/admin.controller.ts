import { Response } from "express";
import { User } from "../model/User";
import { AuthRequest } from "../middleware/auth";
import { Category } from "../model/Category";
import { Brand } from "../model/Brand";
import { Announcement } from "../model/Announcements";
import { Role } from "../model/User";
import { AnnouncementStatus } from "../model/Announcements";

// export const loadUserDetails = async(req: AuthRequest, res: Response) => {
//     try{
//         const page = parseInt(req.query.page as string) || 1;
//         const limit = parseInt(req.query.limit as string) || 10;
//         const skip = (page - 1) * limit;
//         const search = (req.query.search as string) || ""

//         const searchQuery = search ? {
//             $0r: [
//                 {firstname: {$regex: search,$options: "i"}},
//                 {lastname: {$regex: search,$options: "i"}},
//                 {email: {$regex: search,$options: "i"}},
//             ],
//         }
//         :{};

//         const posts = await User.find(searchQuery)
//         .sort({createdAt: -1})
//         .skip(skip)
//         .limit(limit);

//         const total = await User.countDocuments(searchQuery);
//         const totalPages = Math.ceil(total / limit);
        
//         res.status(200).json({
//             message:"User Details fetched successfully in admin page",
//             data:posts,
//             page,
//             totalPages,
//             totalUsers: total
//         })

//     }catch(error:any){
//         res.status(500).json({
//             message:"Error in Fetching User Details in admin page",
//             error: error?.message
//         })
//     }
// }

export const loadUserDetails = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string)?.trim() || ""; // <-- safe access
    const skip = (page - 1) * limit;

    // Build Mongo query
    const query = search
      ? {
          $or: [
            { firstname: { $regex: search, $options: "i" } },
            { lastname: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      message: "User Details fetched successfully",
      data: users,
      page,
      totalPages,
      totalUsers: total,
    });
  } catch (error: any) {
    console.error("Error fetching users:", error); // <-- log for debugging
    res.status(500).json({
      message: "Error in Fetching User Details in admin page",
      error: error?.message,
    });
  }
};
  

export const getAdminDashboardStats = async (req: AuthRequest, res: Response) => {
    try {
        // --- USERS ---
        const totalUsers = await User.countDocuments({});
        const totalAdmins = await User.countDocuments({ role: Role.ADMIN });
        const totalNormalUsers = await User.countDocuments({ role: Role.USER });

        // --- CATEGORIES ---
        const totalCategories = await Category.countDocuments({});

        // --- BRANDS ---
        const totalBrands = await Brand.countDocuments({});

        // --- ANNOUNCEMENTS ---
        const totalAnnouncements = await Announcement.countDocuments({});
        const publishedAnnouncements = await Announcement.countDocuments({
            status: AnnouncementStatus.PUBLISHED
        });
        const unpublishedAnnouncements = await Announcement.countDocuments({
            status: AnnouncementStatus.UNPUBLISHED
        });

        return res.status(200).json({
            message: "Admin Dashboard Stats fetched successfully",
            data: {
                users: {
                    totalUsers,
                    totalAdmins,
                    totalNormalUsers
                },
                categories: {
                    totalCategories
                },
                brands: {
                    totalBrands
                },
                announcements: {
                    totalAnnouncements,
                    publishedAnnouncements,
                    unpublishedAnnouncements
                }
            }
        });

    } catch (error) {
        console.error("Admin Dashboard Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};
