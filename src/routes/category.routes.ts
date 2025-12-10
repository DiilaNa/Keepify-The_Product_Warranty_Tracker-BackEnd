import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { authorizeRoles } from "../middleware/roles";
import { Role } from "../model/User";
import {upload} from "../middleware/upload"
import { save_category } from "../controller/Popups.admin/category.controller";
import { get_category_to_combo } from "../controller/Popups.admin/brands.controller";

const categoriesRouter = Router();


categoriesRouter.post("/saveCategory", authenticate, authorizeRoles([Role.ADMIN]),upload.single("image"), save_category)
categoriesRouter.get("/loadCategoriesInCombo",authenticate,get_category_to_combo)


export default categoriesRouter;