import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { authorizeRoles } from "../middleware/roles";
import { Role } from "../model/User";
import { save_brand } from "../controller/Popups.admin/brands.controller";

const brandsRouter = Router();


brandsRouter.post("/saveBrand", authenticate, authorizeRoles([Role.ADMIN]),save_brand)

export default brandsRouter;