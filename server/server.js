// server.js - Main Entry Point
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");

// Load environment variables
dotenv.config();

// Import configurations and utilities
const { connectDB } = require("./src/config/database");
const { corsOptions } = require("./src/config/cors");
const rateLimitConfig = require("./src/config/rateLimit");
const { errorHandler, notFoundHandler } = require("./src/middleware/errorHandler");
const requestLogger = require("./src/middleware/requestLogger");

// Import routes
const switchRoutes = require("./src/routes/switchRoutes");
const healthRoutes = require("./src/routes/healthRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());

// CORS middleware
app.use(cors(corsOptions));

// Rate limiting
app.use(rateLimitConfig);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));

// Request logging middleware
app.use(requestLogger);

// Routes
app.use("/api-snm", healthRoutes);
app.use("/api-snm", switchRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handling middleware
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = require("./src/utils/gracefulShutdown");
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// Start server
app.listen(PORT, () => {
    console.log("=== Switch Network Management API ===");
    console.log(`Server running on port: ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`MongoDB URI: ${process.env.MONGODB_URI}`);
    console.log(`Available endpoints:`);
    console.log(`- GET /api-snm/health`);
    console.log(`- GET /api-snm/switch`);
    console.log(`- POST /api-snm/switch`);
    console.log(`- DELETE /api-snm/switch`);
    console.log(`- GET /api-snm/status`);
    console.log(`- POST /api-snm/backup`);
    console.log(`- POST /api-snm/restore`);
    console.log(`========================================`);
});

module.exports = app;
