import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { authorizeRoles } from "../middleware/roles";
import { Role } from "../model/User";
import { save_warranty } from "../controller/popups.user/warranty.controller";
import {upload} from "../middleware/upload"
import { getWarrantyDashboardStats, loadWarrantyPosts, searchWarranties } from "../controller/user.controller";
import { viewWarranty } from "../controller/popups.user/viewBill.controller";

const warrantyRouter = Router();

warrantyRouter.post(
  "/saveWarranty",
  authenticate,
  authorizeRoles([Role.USER]),
  upload.single("bill_image"),
  save_warranty
);
warrantyRouter.get("/loadwarranties",authenticate,authorizeRoles([Role.USER]),loadWarrantyPosts)
warrantyRouter.get("/view/:id", authenticate, authorizeRoles([Role.USER]),viewWarranty);
warrantyRouter.get("/dashboard-stats", authenticate, authorizeRoles([Role.USER]), getWarrantyDashboardStats);
warrantyRouter.get("/search", authenticate, authorizeRoles([Role.USER]), searchWarranties)
export default warrantyRouter;