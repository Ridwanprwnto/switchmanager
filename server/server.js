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
app.use(process.env.API_PATH, healthRoutes);
app.use(process.env.API_PATH, switchRoutes);

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
    console.log("=== Topology Network Management API ===");
    console.log(`Server running on port: ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`MongoDB URI: ${process.env.MONGODB_URI}`);
    console.log(`Available endpoints:`);
    console.log(`- GET ${process.env.API_PATH}/health`);
    console.log(`- GET ${process.env.API_PATH}/switch`);
    console.log(`- POST ${process.env.API_PATH}/switch`);
    console.log(`- DELETE ${process.env.API_PATH}/switch`);
    console.log(`- GET ${process.env.API_PATH}/status`);
    console.log(`- POST ${process.env.API_PATH}/backup`);
    console.log(`- POST ${process.env.API_PATH}/restore`);
    console.log(`========================================`);
});

module.exports = app;
