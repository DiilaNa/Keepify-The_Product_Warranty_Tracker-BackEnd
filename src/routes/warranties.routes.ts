import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { authorizeRoles } from "../middleware/roles";
import { Role } from "../model/User";
import { delete_warranty, save_warranty, update_warranty } from "../controller/popups.user/warranty.controller";
import {upload} from "../middleware/upload"
import { getWarrantyDashboardStats, loadWarrantyPosts } from "../controller/user.controller";
import { viewWarranty } from "../controller/popups.user/viewBill.controller";
import { getWarrantiesLineChart } from "../controller/admin.controller";

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
warrantyRouter.put(
  "/updateWarranty/:id",
  authenticate,
  authorizeRoles([Role.USER]),
  upload.single("bill_image"),
  update_warranty
);

warrantyRouter.put(
  "/deleteWarranty/:id",
  authenticate,
  authorizeRoles([Role.USER]),
  delete_warranty
);

warrantyRouter.get("/warranties-overtime",authenticate,authorizeRoles([Role.ADMIN]),getWarrantiesLineChart);
export default warrantyRouter;