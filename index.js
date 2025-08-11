import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";
import committeeRoutes from "./routes/committee.js";
import registrationRoutes from "./routes/registrations.js";
import healthRoutes from "./routes/healthCheck.js";
import uploadFileRoute from "./routes/uploadFile.js";
import volunteerRoutes from "./routes/volunteer.js";
import applicationRoutes from "./routes/applications.js";
import staticContentRoutes from "./routes/staticContent.routes.js";
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
app.use("/api/registrations", registrationRoutes);
app.use("/api", uploadFileRoute);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/static-content", staticContentRoutes);
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
    message: "Route not found"
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`🚀 Nuvoriya Event Management Server running on port ${PORT}`)
);
