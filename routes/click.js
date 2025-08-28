import express from "express";
import { clickHandler } from "../controllers/clickcontroller.js";

const router = express.Router();

router.post("/click", clickHandler);

export default router;