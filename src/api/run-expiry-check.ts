import { Request, Response } from "express";
import { checkExpiryNotifications } from "../config/check-expiry";
import { sendEmail } from "../utils/sendEmail";

export const runExpiryCheck = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers["authorization"];

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
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
