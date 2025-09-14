// utils/gracefulShutdown.js
const mongoose = require("mongoose");

/**
 * Handle graceful server shutdown
 */
const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} received, shutting down Switch API server gracefully...`);

    try {
        // Close database connection
        await mongoose.connection.close();
        console.log("MongoDB connection closed");

        // Close any other connections here (Redis, etc.)

        console.log("Graceful shutdown completed");
        process.exit(0);
    } catch (error) {
        console.error("Error during shutdown:", error);
        process.exit(1);
    }
};

module.exports = gracefulShutdown;
