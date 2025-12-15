import { Response } from "express";
import { Warranty } from "../model/Warranty";
import { AuthRequest } from "../middleware/auth";
import { Notification } from "../model/Notification";

export const loadWarrantyPosts = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const search = (req.query.search as string) || "";

    const filter: any = {
      ownerId: req.user.sub,
      status: "ACTIVE",
    };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { serial_number: { $regex: search, $options: "i" } },
      ];
    }

    const posts = await Warranty.find(filter)
      .populate({
        path: "category",
        select: "name image_url",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Warranty.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      message: "Warranty Posts fetched successfully",
      data: posts,
      page,
      totalPages,
      totalWarranties: total,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error in fetching Warranty Posts",
      error: error?.message,
    });
  }
};
  
export const getWarrantyDashboardStats = async (req: AuthRequest, res: Response) => {
    try {
        const ownerId = req.user.sub 

        const now = new Date();

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const next7Days = new Date();
        next7Days.setDate(next7Days.getDate() + 7);

        const baseFilter = { ownerId, status: "ACTIVE" };

        const totalWarranties = await Warranty.countDocuments(baseFilter);

        const expiringThisMonth = await Warranty.countDocuments({
            ownerId,
            status: "ACTIVE",
            expiry_date: { $gte: startOfMonth, $lte: endOfMonth }
        });

        const expiringNext7Days = await Warranty.countDocuments({
          ownerId,
          status: "ACTIVE",
          expiry_date: { $gte: now, $lte: next7Days },
        });

        const alreadyExpired = await Warranty.countDocuments({
          ownerId,
          status: "EXPIRED",
          expiry_date: { $lt: now },
        });

        return res.status(200).json({
            message: "User dashboard stats fetched successfully",
            data: {
                ownerId,
                totalWarranties,
                expiringThisMonth,
                expiringNext7Days,
                alreadyExpired
            }
        });

    } catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getNotifications = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.sub;

        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

        const unreadCount = await Notification.countDocuments({ userId, read: false });

        res.json({ 
            success: true,
            count: notifications.length,
            unreadCount,
            data: notifications,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch notifications", error });
    }
};

export const markNotificationRead = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.sub;
        const { id } = req.params;

        const notification = await Notification.findOne({ _id: id, userId });
        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

        notification.read = true;
        await notification.save();

        res.json({
            success: true, 
            message: "Notification marked as read",
            data: notification });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update notification", error });
    }
};
