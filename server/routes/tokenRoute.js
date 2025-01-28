import express from "express";
import { createToken } from "../controllers/getToken.js";

const router = express.Router();

router.get("/", createToken);

export default router;
