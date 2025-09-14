// config/apiConfig.js
const API_CONFIG = {
    API_KEY: process.env.API_KEY,
    API_KEY_HEADER: "X-API-Key",
    USER_ID_HEADER: "X-User-ID",
};

// Validate required environment variables
if (!API_CONFIG.API_KEY) {
    console.warn("Warning: API_KEY environment variable is not set");
}

module.exports = API_CONFIG;
