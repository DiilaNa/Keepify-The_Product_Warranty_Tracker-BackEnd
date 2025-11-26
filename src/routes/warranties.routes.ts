import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { authorizeRoles } from "../middleware/roles";
import { Role } from "../model/User";
import { save_warranty } from "../controller/popups.user/warranty.controller";
import {upload} from "../middleware/upload"

const warrantyRouter = Router();


warrantyRouter.post("/saveWarranty", authenticate, authorizeRoles([Role.USER]),upload.single("image"),save_warranty)

export default warrantyRouter;