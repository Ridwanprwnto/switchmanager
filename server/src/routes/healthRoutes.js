// routes/healthRoutes.js
const express = require("express");
const mongoose = require("mongoose");
const { optionalApiKey } = require("../middleware/auth");

const router = express.Router();

// GET - Health check
router.get("/health", optionalApiKey, (req, res) => {
    const healthStatus = {
        success: true,
        status: "OK",
        timestamp: new Date().toISOString(),
        service: "Switch Network Management API",
        version: "1.0.0",
        mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        authenticated: req.authenticated || false,
    };

    console.log("Health check - Authenticated:", req.authenticated);
    res.json(healthStatus);
});

module.exports = router;
