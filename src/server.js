import express from "express";
import cors from "cors";
import dotenv from "dotenv";
const app = express();

dotenv.config();

app.use(express.json())
app.use(cors());
app.get("/status",(req,res)=>{
    return res.send("OK");
})

app.listen(4000,console.log('On The Line'));