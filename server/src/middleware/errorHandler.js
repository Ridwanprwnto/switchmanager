// middleware/errorHandler.js
const mongoose = require("mongoose");

// 404 Not Found Handler
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        error: "Endpoint tidak ditemukan",
        path: req.path,
        method: req.method,
        availableEndpoints: [
            `GET ${process.env.API_PATH}/health`,
            `GET ${process.env.API_PATH}/switch`,
            `POST ${process.env.API_PATH}/switch`,
            `DELETE ${process.env.API_PATH}/switch`,
            `GET ${process.env.API_PATH}/status`,
            `POST ${process.env.API_PATH}/backup`,
            `POST ${process.env.API_PATH}/restore`,
        ],
    });
};

// Global Error Handler
const errorHandler = (error, req, res, next) => {
    console.error("=== Unhandled Error ===");
    console.error("Path:", req.path);
    console.error("Method:", req.method);
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
    console.error("=====================");

    const errorResponse = {
        success: false,
        error: "Internal server error",
        timestamp: new Date().toISOString(),
        path: req.path,
        method: req.method,
    };

    // Handle specific error types
    if (error instanceof mongoose.Error.ValidationError) {
        errorResponse.error = "Data validation error";
        errorResponse.code = "VALIDATION_ERROR";
        if (process.env.NODE_ENV === "development") {
            errorResponse.validationErrors = Object.values(error.errors).map((e) => e.message);
        }
        return res.status(400).json(errorResponse);
    }

    if (error instanceof mongoose.Error.CastError) {
        errorResponse.error = "Invalid data format";
        errorResponse.code = "CAST_ERROR";
        return res.status(400).json(errorResponse);
    }

    if (error.name === "MongoError" && error.code === 11000) {
        errorResponse.error = "Duplicate data error";
        errorResponse.code = "DUPLICATE_ERROR";
        return res.status(409).json(errorResponse);
    }

    // Add details in development mode
    if (process.env.NODE_ENV === "development") {
        errorResponse.details = error.message;
        errorResponse.stack = error.stack;
    }

    res.status(500).json(errorResponse);
};

module.exports = {
    notFoundHandler,
    errorHandler,
};
