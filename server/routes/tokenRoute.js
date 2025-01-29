import express from "express";
import { createToken, stkPush } from "../controllers/getToken.js";

const router = express.Router();

router.post("/stkpush", createToken, stkPush);

export default router;
