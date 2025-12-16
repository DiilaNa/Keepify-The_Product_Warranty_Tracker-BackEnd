import { Router } from "express";
import { runExpiryCheck } from "../api/run-expiry-check";

const cronRouter = Router();

cronRouter.get("/run-expiry-check", runExpiryCheck);

export default cronRouter;
