// middleware/auth.js
const API_CONFIG = require("../config/apiConfig");

const authenticateApiKey = (req, res, next) => {
    if (process.env.NODE_ENV === "production") {
        // 🔹 Production: rely on Kong consumer
        const user = req.headers["x-consumer-username"];

        if (!user) {
            return res.status(401).json({
                status: "error",
                message: "Akses tidak diizinkan. Consumer tidak terdeteksi.",
                code: "CONSUMER_MISSING",
            });
        }

        // Attach user info to request
        req.user = { userId: user.trim() };
        return next();
    }

    // 🔹 Development: manual API key validation
    const apiKey = req.headers[API_CONFIG.API_KEY_HEADER.toLowerCase()];
    const userId = req.headers[API_CONFIG.USER_ID_HEADER.toLowerCase()];

    if (!apiKey) {
        return res.status(401).json({
            success: false,
            error: "API Key diperlukan",
            code: "API_KEY_MISSING",
        });
    }

    if (apiKey !== API_CONFIG.API_KEY) {
        return res.status(403).json({
            success: false,
            error: "API Key tidak valid",
            code: "API_KEY_INVALID",
        });
    }

    if (!userId) {
        return res.status(400).json({
            success: false,
            error: "User ID diperlukan dalam header",
            code: "USER_ID_MISSING",
        });
    }

    // Attach user info to request
    req.user = { userId: userId.trim() };
    next();
};

// Optional API Key middleware untuk endpoint yang tidak wajib auth
const optionalApiKey = (req, res, next) => {
    const apiKey = req.headers[API_CONFIG.API_KEY_HEADER.toLowerCase()];

    if (process.env.NODE_ENV === "development") {
        console.log("=== Optional Auth Debug ===");
        console.log("API Key received:", apiKey || "Missing");
        console.log("Expected API Key:", API_CONFIG.API_KEY);
        console.log("==========================");
    }

    if (apiKey && apiKey === API_CONFIG.API_KEY) {
        req.authenticated = true;
    } else {
        req.authenticated = false;
    }

    next();
};

module.exports = {
    authenticateApiKey,
    optionalApiKey,
};
