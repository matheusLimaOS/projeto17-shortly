import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { userRouter } from "./routers/userRouter.js";

const app = express();

dotenv.config();

app.use(express.json())
app.use(cors());
app.get("/status",(req,res)=>{
    return res.send("OK");
})

app.use(userRouter);

app.listen(4000,console.log('On The Line'));