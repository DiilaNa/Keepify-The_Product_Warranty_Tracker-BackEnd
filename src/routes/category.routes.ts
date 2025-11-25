import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { authorizeRoles } from "../middleware/roles";
import { Role } from "../model/User";
import {upload} from "../middleware/upload"
import { save_category } from "../controller/category.controller";

const categoriesRouter = Router();


categoriesRouter.post("/saveCategory", authenticate, authorizeRoles([Role.ADMIN]),upload.single("image"), save_category)

export default categoriesRouter;