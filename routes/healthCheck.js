import { Router } from "express";
const router = Router();

// Health check route
router.get("/health-check", (req, res) => {
  res.status(200).json({ message: "Server is running smoothly!" });
});

export default router;