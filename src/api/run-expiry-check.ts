import { Request, Response } from "express";
import { checkExpiryNotifications } from "../config/check-expiry";
import { sendEmail } from "../utils/sendEmail";

export const runExpiryCheck = async (req: Request, res: Response) => {
  try {
    const userAgent = req.headers["user-agent"];

    if (!userAgent || !userAgent.includes("Vercel")) {
      return res.status(403).json({
        success: false,
        message: "Forbidden – not a Vercel cron",
      });
    }

    console.log("CRON JOB TRIGGERED:", new Date().toISOString());

    await checkExpiryNotifications();

    await sendEmail(
      "liyanaarachchidilan@gmail.com",
      "Keepify Cron Job Test",
      `<p>The expiry check cron ran successfully at ${new Date().toLocaleString()}</p>`
    );

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
