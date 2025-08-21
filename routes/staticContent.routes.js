import express from "express";
import {
  getStaticContent,
  createStaticContent,
  updateStaticContent,
} from "../controllers/staticContent.controller.js";

const router = express.Router();

router.get("/", getStaticContent);
router.post("/", createStaticContent);
router.put("/", updateStaticContent);

export default router;
