import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { authorizeRoles } from "../middleware/roles";
import { Role } from "../model/User";

const announcementsRouter = Router();


announcementsRouter.post("/saveAnnouncement",authenticate,authorizeRoles([Role.ADMIN]))
// announcementsRouter.get("/getAll",authenticate,authorizeRoles([Role.ADMIN,Role.USER]))

// announcementsRouter.put("/updateAnnouncement",authenticate,authorizeRoles([Role.ADMIN]))
// announcementsRouter.patch("/unpusblishAnnouncement",authenticate,authorizeRoles([Role.ADMIN]))

export default announcementsRouter;