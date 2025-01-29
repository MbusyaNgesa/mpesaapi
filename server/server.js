import express from "express";
import tokenRouter from "./routes/tokenRoute.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Mpesa API");
});

app.listen(3002, () => {
  console.log("Server is running");
});

app.use("/mpesa", tokenRouter);
