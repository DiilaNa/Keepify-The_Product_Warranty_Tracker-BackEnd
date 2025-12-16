// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cors from "cors";

// import auth from "./routes/auth.routes";
// import announcementsRouter from "./routes/announcements.routes";
// import categoriesRouter from "./routes/category.routes";
// import brandsRouter from "./routes/brands.routes";
// import warrantyRouter from "./routes/warranties.routes";
// import notificationRouter from "./routes/notification.routes";
// import cronRouter from "./routes/cron.routes";

// dotenv.config();

// const app = express();

// app.use(
//   cors({
//     origin: "https://keepify-the-product-warranty-tracke.vercel.app",
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );

// app.options("*", cors());

// app.use(express.json());

// app.use("/api/v1/auth", auth);
// app.use("/api/v1/announcements", announcementsRouter);
// app.use("/api/v1/categories", categoriesRouter);
// app.use("/api/v1/brands", brandsRouter);
// app.use("/api/v1/warranties", warrantyRouter);
// app.use("/api/v1/notifications", notificationRouter);
// app.use("/api/v1/cron", cronRouter);

// mongoose.connect(process.env.MONGO_URI as string);

// export default app;

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import auth from "./routes/auth.routes";
import announcementsRouter from "./routes/announcements.routes";
import categoriesRouter from "./routes/category.routes";
import brandsRouter from "./routes/brands.routes";
import warrantyRouter from "./routes/warranties.routes";
import notificationRouter from "./routes/notification.routes";
import cronRouter from "./routes/cron.routes";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

const app = express();

/* ---------------- CORS FIRST ---------------- */
app.use(
  cors({
    origin: "https://keepify-the-product-warranty-tracke.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors());

app.use(express.json());

/* ---------------- ROUTES ---------------- */
app.use("/api/v1/auth", auth);
app.use("/api/v1/announcements", announcementsRouter);
app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/brands", brandsRouter);
app.use("/api/v1/warranties", warrantyRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/cron", cronRouter);

app.get("/", (_req, res) => {
  res.send("API running on Vercel");
});

/* ---------------- MONGODB (SERVERLESS SAFE) ---------------- */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

connectDB().catch(console.error);

export default app;

