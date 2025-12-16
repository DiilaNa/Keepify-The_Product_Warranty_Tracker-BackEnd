import express from "express";
import mongoose from "mongoose";
import { log, error } from "console";
import dotenv from "dotenv";
import auth from "./routes/auth.routes";
import announcementsRouter from "./routes/announcements.routes";
import categoriesRouter from "./routes/category.routes";
import brandsRouter from "./routes/brands.routes";
import warrantyRouter from "./routes/warranties.routes";
import notificationRouter from "./routes/notification.routes";
import cronRouter from "./routes/cron.routes";
import cors from "cors"
dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

const app = express();

app.use(
  cors({
    origin: "https://keepify-the-product-warranty-tracke.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api/v1/auth", auth);
app.use("/api/v1/announcements", announcementsRouter);
app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/brands", brandsRouter);
app.use("/api/v1/warranties", warrantyRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/cron", cronRouter);


mongoose
  .connect(MONGO_URI)
  .then(() => {
    log("DB Connected");
  })
  .catch((err) => {
    error(err);
    process.exit(1);
  });
