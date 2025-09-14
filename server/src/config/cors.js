// config/cors.js
const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost"],
    allowedHeaders: ["Content-Type", "X-API-Key", "X-User-ID", "Authorization"],
    credentials: true,
};

module.exports = { corsOptions };
