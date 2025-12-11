import { Response } from "express";
import { Warranty } from "../model/Warranty";
import { AuthRequest } from "../middleware/auth";
import { Notification } from "../model/Notification";

export const loadWarrantyPosts = async(req: AuthRequest, res: Response) => {
    try{
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const posts = await Warranty.find({ ownerId: req.user.sub })
          .populate({
            path: "category",
            select: "name image_url", // only get name and image_url
          })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit);

        const total = await Warranty.countDocuments({ ownerId: req.user.sub });
        const totalPages = Math.ceil(total / limit);
        
        res.status(200).json({
            message:"Warranty Posts fetched successfully",
            data:posts,
            page,
            totalPages,
            totalWarranties: total
        })

    }catch(error:any){
        res.status(500).json({
            message:"Error in Fetching Warranty Posts",
            error: error?.message
        })
    }
}

export const getWarrantyDashboardStats = async (req: AuthRequest, res: Response) => {
    try {
        const ownerId = req.user.sub // assuming you're using auth middleware

        const now = new Date();

        // Start of current month
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // End of current month
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // Next 7 days range
        const next7Days = new Date();
        next7Days.setDate(next7Days.getDate() + 7);

        // --- Dashboard Queries ---

        // 1. Total warranties
        const totalWarranties = await Warranty.countDocuments({ ownerId });

        // 2. Expiring this month
        const expiringThisMonth = await Warranty.countDocuments({
            ownerId,
            expiry_date: { $gte: startOfMonth, $lte: endOfMonth }
        });

        // 3. Expiring in next 7 days
        const expiringNext7Days = await Warranty.countDocuments({
            ownerId,
            expiry_date: { $gte: now, $lte: next7Days }
        });

        // 4. Already expired warranties
        const alreadyExpired = await Warranty.countDocuments({
            ownerId,
            expiry_date: { $lt: now }
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

export const searchWarranties = async (req: AuthRequest, res: Response) => {
    try {
        const ownerId = req.user.sub;
        const { query, status, category, brand } = req.query;

        const searchFilters: any = { ownerId };

        if (query) {
            searchFilters.$or = [
            { name: { $regex: query as string, $options: "i" } },
            { serial_number: { $regex: query as string, $options: "i" } },
            { description: { $regex: query as string, $options: "i" } },
        ];

        // If user types a date like "2023-04"
        const dateQuery = new Date(query as string);
            if (!isNaN(dateQuery.getTime())) {
                searchFilters.$or.push({ purchase_date: dateQuery });
                searchFilters.$or.push({ expiry_date: dateQuery });
            }
        }

        // Optional filters
        if (status) searchFilters.status = status;
        if (category) searchFilters.category = category;
        if (brand) searchFilters.brandId = brand;

        const results = await Warranty.find(searchFilters)
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Search completed successfully",
            count: results.length,
            data: results
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Search failed", error });
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
