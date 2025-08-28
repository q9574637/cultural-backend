import express from "express";
import { clickHandler, getClickCount } from "../controllers/clickcontroller.js";

const router = express.Router();

router.post("/click", clickHandler);
router.get("/click", getClickCount);

export default router;