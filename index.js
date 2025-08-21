import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";
import committeeRoutes from "./routes/committee.js";
import healthRoutes from "./routes/healthCheck.js";
import uploadFileRoute from "./routes/uploadFile.js";
import ticketRoutes from "./routes/ticket.js";

const app = express();
import connectDb from "./Config/Connection.js";

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    callback(null, true); // Accept all origins
  },
  credentials: true
}));
app.use(json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to database
connectDb();

// Health check route (before auth)
app.use("/api", healthRoutes);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/committee", committeeRoutes);
app.use("/api/ticket", ticketRoutes);
app.use("/api", uploadFileRoute);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Routes not found"
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`🚀 Nuvoriya Event Management Server running on port ${PORT}`)
);
