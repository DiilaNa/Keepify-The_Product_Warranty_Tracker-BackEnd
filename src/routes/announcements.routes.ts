import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { authorizeRoles } from "../middleware/roles";
import { Role } from "../model/User";
import { save_announcement } from "../controller/Popups.admin/announcement.controller";
import { upload } from "../middleware/upload"
import { loadAnnouncements } from "../controller/welcome.controller";
import { editAnnouncements, loadAdminAnnouncements, updateAnnouncementStatus } from "../controller/admin.announcements.controller";

const announcementsRouter = Router();

announcementsRouter.post("/saveAnnouncement", authenticate, authorizeRoles([Role.ADMIN]), upload.single("image"), save_announcement)
announcementsRouter.get("/", loadAnnouncements)
announcementsRouter.get("/admin", authenticate, authorizeRoles([Role.ADMIN]), loadAdminAnnouncements)
announcementsRouter.put("/edit/:id", authenticate,authorizeRoles([Role.ADMIN]),upload.single("image"),editAnnouncements);
announcementsRouter.patch("/status/:id",authenticate,authorizeRoles([Role.ADMIN]),updateAnnouncementStatus);

export default announcementsRouter;