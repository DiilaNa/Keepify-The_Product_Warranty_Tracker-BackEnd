import { Response } from "express";
import { User } from "../model/User";
import { AuthRequest } from "../middleware/auth";
import { Category } from "../model/Category";
import { Brand } from "../model/Brand";
import { Announcement } from "../model/Announcements";
import { Role } from "../model/User";
import { AnnouncementStatus } from "../model/Announcements";
import { Warranty } from "../model/Warranty";

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

export const getWarrantiesLineChart = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const stats = await Warranty.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$purchase_date" },
            month: { $month: "$purchase_date" },
          },
          total: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          total: 1,
        },
      },
    ]);

    res.status(200).json({
      message: "Successfully loaded warranties in line chart",
      data: stats,
    });
  } catch (err: any) {
    res.status(500).json({ message: "server error" });
  }
};

export const getTopBrandsBarChart = async (req: AuthRequest, res: Response) => {
  try {
    const topBrands = await Warranty.aggregate([
      {
        $group: {
          _id: "$brandId",
          total: { $sum: 1 },
        },
      },

      {
        $lookup: {
          from: "brands",
          localField: "_id",
          foreignField: "_id",
          as: "brand",
        },
      },

      { $unwind: "$brand" },

      {
        $project: {
          _id: 0,
          brandName: "$brand.brand_name",
          total: 1,
        },
      },

      { $sort: { total: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({
      message: "Successfully loaded top brands",
      data: topBrands,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
