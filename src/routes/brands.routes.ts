import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { authorizeRoles } from "../middleware/roles";
import { Role } from "../model/User";
import { save_brand } from "../controller/Popups.admin/brands.controller";
import { get_brands_by_category } from "../controller/popups.user/warranty.controller";

const brandsRouter = Router();


brandsRouter.post("/saveBrand", authenticate, authorizeRoles([Role.ADMIN]),save_brand)
brandsRouter.get(
  "/loadBrandsInCombo/:category",
  authenticate,
  authorizeRoles([Role.USER]),
  get_brands_by_category
);

export default brandsRouter;