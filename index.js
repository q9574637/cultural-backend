import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initializeGoogleSheets, initializeAllSheets } from "./config/googleSheets.js";
import { connectDB } from "./models/index.js";

// Import routes
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";
import healthRoutes from "./routes/health.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    callback(null, true); // Accept all origins
  },
  credentials: true
}));
app.use(json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.get("/", (req, res) => {
  res.send("Server is Running Successfully");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/health-check", healthRoutes);

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

// Initialize Google Sheets Database
async function startServer() {
  try {
    // Initialize Google Sheets API
    await initializeGoogleSheets();
    
    // Initialize all required sheets
    await initializeAllSheets();
    
    // Connect to database
    await connectDB();
    
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🚀 Nuvoriya Event Management Server running on port ${PORT}`);
      console.log(`📊 Using Google Sheets as database`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
