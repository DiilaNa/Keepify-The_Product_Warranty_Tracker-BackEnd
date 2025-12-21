import { Warranty, WarrantyStatus } from "../model/Warranty";
import { Notification, NotificationType } from "../model/Notification";
import { sendEmail } from "../utils/sendEmail";
import dayjs from "dayjs";

export const checkExpiryNotifications = async () => {
    try {
        const today = dayjs();

        const warranties = await Warranty.find().populate("ownerId");

        for (const warranty of warranties as any[]) {
            const expiry = dayjs(warranty.expiry_date);
            const diffDays = expiry.diff(today, "day");

            let title = "";
            let message = "";
            let type: NotificationType | null = null;
            let warrantyStatus: WarrantyStatus | null = null;

            if (diffDays === 30) {
                title = "Warranty expires in 1 month";
                message = `Your warranty for ${warranty.name} expires in 30 days.`;
                type = NotificationType.EXPIRY_SOON;
            } else if (diffDays === 7) {
                title = "Warranty expires in 1 week";
                message = `Your warranty for ${warranty.name} expires in 7 days.`;
                type = NotificationType.EXPIRY_SOON;
            } else if (diffDays === 1) {
                title = "Warranty expires tomorrow";
                message = `Your warranty for ${warranty.name} expires tomorrow.`;
                type = NotificationType.EXPIRY_SOON;
            } else if (diffDays === 0) {
                title = "Warranty expires today";
                message = `Your warranty for ${warranty.name} expires today.`;
                type = NotificationType.EXPIRED;
                warrantyStatus = WarrantyStatus.EXPIRED;
            } else if (diffDays === -1) {
                title = "Warranty expired yesterday";
                message = `Your warranty for ${warranty.name} expired yesterday.`;
                type = NotificationType.EXPIRED;
            }

            if (!type) continue;

            const exists = await Notification.findOne({
                userId: warranty.ownerId._id,
                warrantyId: warranty._id,
                message,
            });

            if (!exists) {
              await Notification.create({
                title,
                message,
                type,
                userId: warranty.ownerId._id,
                warrantyId: warranty._id,
              });

              if (diffDays <= 0 && warranty.status !== WarrantyStatus.EXPIRED) {
                warranty.status = WarrantyStatus.EXPIRED;
                await warranty.save();
              }

              const userEmail = warranty.ownerId.email;
              if (userEmail) {
                await sendEmail(userEmail, title, `<p>${message}</p>`);
              }
            }
        }
    console.log("Expiry check complete");
    } catch (error) {
        console.error("Error in expiry check:", error);
    }
};
