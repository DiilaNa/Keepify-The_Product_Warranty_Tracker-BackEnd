import { Request, Response } from "express";
import { checkExpiryNotifications } from "../config/check-expiry";
import dotenv from "dotenv";

dotenv.config();

const CRON_SECRET = process.env.CRON_SECRET

export const runExpiryCheck = async function(req: Request, res: Response) {
  try {
    if (req.headers["x-cron-token"] !== CRON_SECRET) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    await checkExpiryNotifications(); 
    res.status(200).json({ success: true, message: "Expiry check completed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed", error });
  }
}
