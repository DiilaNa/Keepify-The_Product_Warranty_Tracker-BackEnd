import  express from "express";
import mongoose from "mongoose";
import { log , error } from "console";
import dotenv from "dotenv"
import cors from "cors"
import auth from "./routes/auth.routes"
import announcementsRouter from "./routes/announcements.routes";
import categoriesRouter from "./routes/category.routes";
import brandsRouter from "./routes/brands.routes";
import warrantyRouter from "./routes/warranties.routes";
import notificationRouter from "./routes/notification.routes";

dotenv.config()

const SERVER_PORT = process.env.SERVER_PORT;
const MONGO_URI = process.env.MONGO_URI as string

const app = express();

app.use(express.json())

app.use(cors({
  origin:["http://localhost:5173"],
  methods:["GET","POST","PUT","DELETE"]
}))

app.use("/api/v1/auth",auth)
app.use("/api/v1/announcements",announcementsRouter)
app.use("/api/v1/categories", categoriesRouter)
app.use("/api/v1/brands", brandsRouter)
app.use("/api/v1/warranties",warrantyRouter)
app.use("/api/v1/notifications", notificationRouter)

mongoose
.connect(MONGO_URI)
.then(()=>{
    log("DB Connected")
}).catch((err)=>{
    error(err)
    process.exit(1)
})

app.listen(SERVER_PORT, () => {
  console.log(`Server running on port ${SERVER_PORT}`);
});
