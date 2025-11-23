import  express from "express";
import mongoose from "mongoose";
import { log , error } from "console";
import dotenv from "dotenv"

dotenv.config()
const SERVER_PORT = process.env.SERVER_PORT;
const MONGO_URI = process.env.MONGO_URI as string

const app = express();

app.use(express.json())


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
