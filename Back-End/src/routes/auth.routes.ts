import { Router } from "express";
import { handleRefreshToken, login, register } from "../controller/auth.controller";

const router = Router();

router.post("/register",register)
router.post("/login",login)
router.post("/refresh",handleRefreshToken)


export default router;