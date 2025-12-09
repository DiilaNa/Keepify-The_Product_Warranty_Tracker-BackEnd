import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { authorizeRoles } from "../middleware/roles";
import { Role } from "../model/User";
import { get_category_to_combo, save_brand } from "../controller/Popups.admin/brands.controller";

const brandsRouter = Router();


brandsRouter.post("/saveBrand", authenticate, authorizeRoles([Role.ADMIN]),save_brand)
brandsRouter.get("/loadCategoriesInCombo",authenticate,authorizeRoles([Role.USER]),get_category_to_combo)

export default brandsRouter;