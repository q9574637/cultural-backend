import { Router } from "express";
import uploadToCloudinary from "../middlewares/multer.js";

const router = Router();
router.post("/upload", ...uploadToCloudinary);

export default router;