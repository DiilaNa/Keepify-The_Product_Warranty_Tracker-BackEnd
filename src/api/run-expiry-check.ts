import { Request, Response } from "express";
import { checkExpiryNotifications } from "../config/check-expiry";

const CRON_SECRET = process.env.CRON_SECRET;

export const runExpiryCheck = async (req: Request, res: Response) => {
  try {
    const token = req.headers["x-cron-token"];

    if (!token || token !== CRON_SECRET) {
      return res.status(403).json({
        success: false,
        message: "Forbidden – invalid cron token",
      });
    }

    await checkExpiryNotifications();

    return res.status(200).json({
      success: true,
      message: "Expiry notifications generated",
    });
  } catch (error) {
    console.error("Cron error:", error);
    return res.status(500).json({
      success: false,
      message: "Cron failed",
    });
  }
};
