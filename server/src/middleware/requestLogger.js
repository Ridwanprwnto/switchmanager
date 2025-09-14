// middleware/requestLogger.js
const requestLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const userAgent = req.get("User-Agent") || "Unknown";
    const userId = req.headers["x-user-id"] || "Anonymous";

    console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${req.ip} - User: ${userId}`);

    // Log body for POST/PUT requests in development
    if (process.env.NODE_ENV === "development" && ["POST", "PUT", "PATCH"].includes(req.method)) {
        console.log("Request body size:", JSON.stringify(req.body).length, "characters");
    }

    next();
};

module.exports = requestLogger;
