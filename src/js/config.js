// config.js - Configuration file untuk Topology Network Manager Webb App

// API Configuration - Memisahkan Login API dan Switch Data API
const API_CONFIG = {
    // API untuk Authentication/Login
    AUTH_API: {
        BASE_URL: "http://192.168.33.146:8000/api-ims",
        LOGIN_ENDPOINT: "/auth/users/login",
    },

    // API untuk Switch Data Management
    SWITCH_API: {
        BASE_URL: "http://192.168.33.146:8000/api-topology",
        ENDPOINTS: {
            SWITCH_DATA: "/switch",
            HEALTH: "/health",
            RESTORE: "/restore",
            BACKUP: "/backup",
        },
        // API Key untuk Switch Data API
        API_KEY: "supersecretapikey123",
        API_KEY_HEADER: "X-API-Key", // Header name untuk API key
    },

    REQUEST_TIMEOUT: 30000, // 30 detik
    AUTO_SAVE_DELAY: 5000, // 5 detik
    MAX_RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 detik
};

// Application Configuration
const APP_CONFIG = {
    MAX_PORTS: 48,
    MIN_PORT: 1,
    IP_REGEX: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    SWITCH_NAME_REGEX: /^[A-Z0-9\-_]+$/i,
    AUTO_SAVE_ENABLED: true,
    CONNECTION_CHECK_INTERVAL: 30000, // 30 detik
    REFRESH_COUNTDOWN: 60, // 60 detik untuk countdown refresh
};

// UI Messages dalam Bahasa Indonesia
const MESSAGES = {
    LOADING: "Memuat data dari server...",
    SAVE_SUCCESS: "Data berhasil disimpan",
    SAVE_ERROR: "Gagal menyimpan data",
    LOAD_SUCCESS: "Data berhasil dimuat",
    LOAD_ERROR: "Gagal memuat data dari server",
    CONNECTION_ERROR: "Tidak dapat terhubung ke server",
    SESSION_EXPIRED: "Sesi berakhir. Silakan masuk kembali.",
    VALIDATION_ERROR: "Harap perbaiki error validasi sebelum melanjutkan",
    CONFIRM_DELETE: "Apakah Anda yakin ingin menghapus item ini?",
    CONFIRM_LOGOUT: "Apakah Anda yakin ingin keluar?",
    EXPORT_SUCCESS: "Data berhasil diekspor",
    IMPORT_SUCCESS: "Data berhasil diimpor",
    BACKUP_SUCCESS: "Backup berhasil diunduh",
    RESTORE_SUCCESS: "Data berhasil diimport dan direstore ke server",
    LOGIN_SUCCESS: "Login berhasil",
    LOGIN_ERROR: "Login gagal",
    REFRESH_DATA: "Refresh data dari server? Perubahan yang belum disimpan akan hilang.",
    DATA_NOT_LOADED: "Data belum dimuat",
    NODE_NOT_SELECTED: "Tidak ada node yang dipilih",
    NODE_ADDED: "node berhasil ditambahkan",
    NODE_DELETED: "Node berhasil dihapus",
    PORT_ADDED: "Port baru berhasil ditambahkan",
    PORT_DELETED: "Port berhasil dihapus",
    INFO_UPDATED: "Informasi port dan node berhasil diperbarui",
    API_KEY_INVALID: "API Key tidak valid",
    UNAUTHORIZED: "Tidak memiliki akses ke layanan ini",
};

// Default Switch Data Template
const DEFAULT_SWITCH_DATA = {
    id: "1",
    name: "SW-RUANG-SERVER",
    ip: "192.168.0.1",
    jenis: "Core Switch",
    sn: "SN-001",
    ch: [{ port: "01", segment: "192.168.0.1", trunk: "N", status: "Y", ip: "192.168.0.101", keterangan: "Port 01 uplink" }],
    children: [],
};

// Environment Detection
const ENV = {
    isDevelopment: () => window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1",
    isProduction: () => !ENV.isDevelopment(),

    getAuthApiUrl: () => {
        if (ENV.isDevelopment()) {
            return window.location.origin + ":4000/api-ims";
        } else {
            return API_CONFIG.AUTH_API.BASE_URL;
        }
    },

    getSwitchApiUrl: () => {
        if (ENV.isDevelopment()) {
            return window.location.origin + ":5000/api-topology";
        } else {
            return API_CONFIG.SWITCH_API.BASE_URL;
        }
    },
};

// Utility Functions
const Utils = {
    generateId: () => new Date().getTime() * 1000 + Math.floor(Math.random() * 1001),

    formatDate: (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    },

    validateIP: (ip) => {
        if (!ip || !APP_CONFIG.IP_REGEX.test(ip)) {
            return false;
        }
        const parts = ip.split(".");
        return parts.every((part) => {
            const num = parseInt(part, 10);
            return num >= 0 && num <= 255;
        });
    },

    validateSwitchName: (name) => {
        return name && name.trim().length > 0 && APP_CONFIG.SWITCH_NAME_REGEX.test(name.trim());
    },

    deepClone: (obj) => {
        return JSON.parse(JSON.stringify(obj));
    },

    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    showNotification: (message, type = "info", duration = 3000) => {
        let container = document.getElementById("notification-container");
        if (!container) {
            container = document.createElement("div");
            container.id = "notification-container";
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 300px;
            `;
            document.body.appendChild(container);
        }

        const notification = document.createElement("div");
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            padding: 12px 16px;
            margin-bottom: 8px;
            border-radius: 4px;
            color: white;
            font-weight: 500;
            animation: slideInRight 0.3s ease;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            background: ${type === "success" ? "#28a745" : type === "error" ? "#dc3545" : type === "warning" ? "#ffc107" : "#007bff"};
        `;

        if (!document.getElementById("notification-styles")) {
            const style = document.createElement("style");
            style.id = "notification-styles";
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        container.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = "slideOutRight 0.3s ease";
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);

        notification.addEventListener("click", () => {
            notification.style.animation = "slideOutRight 0.3s ease";
            setTimeout(() => notification.remove(), 300);
        });
    },
};

// API Helper Functions
const ApiHelper = {
    getAuthHeaders: () => {
        const token = localStorage.getItem("authToken");
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };
    },

    getSwitchHeaders: () => {
        const userId = localStorage.getItem("loggedInID");
        return {
            [API_CONFIG.SWITCH_API.API_KEY_HEADER]: API_CONFIG.SWITCH_API.API_KEY,
            "Content-Type": "application/json",
            "X-User-ID": userId || "",
        };
    },

    // PERBAIKAN: Method untuk health check tanpa user ID requirement
    getSwitchHeadersForHealth: () => {
        return {
            [API_CONFIG.SWITCH_API.API_KEY_HEADER]: API_CONFIG.SWITCH_API.API_KEY,
            "Content-Type": "application/json",
        };
    },

    handleError: (error, defaultMessage = "Terjadi kesalahan") => {
        console.error("API Error:", error);
        let errorMessage = defaultMessage;

        if (error.responseJSON && error.responseJSON.message) {
            errorMessage = error.responseJSON.message;
        } else if (error.responseJSON && error.responseJSON.error) {
            errorMessage = error.responseJSON.error;
        } else if (error.status === 401) {
            errorMessage = MESSAGES.SESSION_EXPIRED;
            StorageHelper.clearAuth();
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);
            return;
        } else if (error.status === 403) {
            errorMessage = MESSAGES.UNAUTHORIZED;
        } else if (error.status === 404) {
            errorMessage = "Endpoint tidak ditemukan";
        } else if (error.status === 500) {
            errorMessage = "Error server internal";
        } else if (error.status === 0) {
            errorMessage = MESSAGES.CONNECTION_ERROR;
        }

        Utils.showNotification(errorMessage, "error");
        return errorMessage;
    },

    authRequest: async (options) => {
        const { endpoint, method = "POST", data, retries = API_CONFIG.MAX_RETRY_ATTEMPTS } = options;

        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const response = await $.ajax({
                    url: ENV.getAuthApiUrl() + endpoint,
                    method: method,
                    headers: { "Content-Type": "application/json" },
                    data: data ? JSON.stringify(data) : undefined,
                    timeout: API_CONFIG.REQUEST_TIMEOUT,
                });
                return response;
            } catch (error) {
                if (attempt === retries) {
                    throw error;
                }
                await new Promise((resolve) => setTimeout(resolve, API_CONFIG.RETRY_DELAY * attempt));
            }
        }
    },

    switchRequest: async (options) => {
        const { endpoint, method = "GET", data, retries = API_CONFIG.MAX_RETRY_ATTEMPTS } = options;

        const userId = localStorage.getItem("loggedInID");
        if (!userId && endpoint !== API_CONFIG.SWITCH_API.ENDPOINTS.HEALTH) {
            throw new Error("User belum login");
        }

        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                // PERBAIKAN: Gunakan header yang sesuai untuk health check
                const headers = endpoint === API_CONFIG.SWITCH_API.ENDPOINTS.HEALTH ? ApiHelper.getSwitchHeadersForHealth() : ApiHelper.getSwitchHeaders();

                const response = await $.ajax({
                    url: ENV.getSwitchApiUrl() + endpoint,
                    method: method,
                    headers: headers,
                    data: data ? JSON.stringify(data) : undefined,
                    timeout: API_CONFIG.REQUEST_TIMEOUT,
                });
                return response;
            } catch (error) {
                if (attempt === retries) {
                    throw error;
                }
                await new Promise((resolve) => setTimeout(resolve, API_CONFIG.RETRY_DELAY * attempt));
            }
        }
    },

    // PERBAIKAN: Method khusus untuk health check yang lebih sederhana
    healthCheck: async () => {
        try {
            const response = await $.ajax({
                url: ENV.getSwitchApiUrl() + API_CONFIG.SWITCH_API.ENDPOINTS.HEALTH,
                method: "GET",
                headers: ApiHelper.getSwitchHeadersForHealth(),
                timeout: 5000, // Timeout lebih pendek untuk health check
            });
            return response;
        } catch (error) {
            console.error("Health check failed:", error);
            throw error;
        }
    },
};

// Local Storage Helper
const StorageHelper = {
    get: (key, fallback = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : fallback;
        } catch (e) {
            console.error("Storage get error:", e);
            return fallback;
        }
    },

    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error("Storage set error:", e);
            return false;
        }
    },

    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error("Storage remove error:", e);
            return false;
        }
    },

    clearAuth: () => {
        StorageHelper.remove("authToken");
        StorageHelper.remove("loggedInID");
        StorageHelper.remove("loggedInNIK");
        StorageHelper.remove("loggedInUser");
    },

    isAuthenticated: () => {
        return !!localStorage.getItem("loggedInID");
    },
};

// PERBAIKAN: Connection Monitor yang lebih robust
const ConnectionMonitor = {
    isOnline: navigator.onLine,
    callbacks: [],
    healthCheckInterval: null,

    onStatusChange: (callback) => {
        ConnectionMonitor.callbacks.push(callback);
    },

    // Update status
    updateStatus: (online) => {
        console.log("Connection status updating:", online); // debug log
        ConnectionMonitor.isOnline = online;

        // Panggil semua callback
        ConnectionMonitor.callbacks.forEach((callback) => callback(online));

        // Selalu update UI (meskipun status tidak berubah)
        const statusEl = document.getElementById("connection-status");
        if (statusEl) {
            if (online) {
                statusEl.textContent = "Online";
                statusEl.className = "connection-status online";
            } else {
                statusEl.textContent = "Offline";
                statusEl.className = "connection-status offline";
            }
        }
    },

    // PERBAIKAN: Fungsi health check yang lebih baik
    performHealthCheck: async () => {
        try {
            console.log("Performing health check...");
            const response = await ApiHelper.healthCheck();
            console.log("Health check successful:", response);
            ConnectionMonitor.updateStatus(true);
            return true;
        } catch (error) {
            console.error("Health check failed:", error);
            // Hanya update ke offline jika error karena connection issue (status 0)
            if (error.status === 0 || error.status === undefined) {
                ConnectionMonitor.updateStatus(false);
            } else {
                console.log("Health check failed but keeping online status (error:", error.status, ")");
            }
            return false;
        }
    },

    init: () => {
        console.log("Initializing Connection Monitor...");

        // Browser online/offline events
        window.addEventListener("online", () => {
            console.log("Browser online event");
            ConnectionMonitor.updateStatus(true);
        });

        window.addEventListener("offline", () => {
            console.log("Browser offline event");
            ConnectionMonitor.updateStatus(false);
        });

        // Initial health check
        setTimeout(() => {
            ConnectionMonitor.performHealthCheck();
        }, 2000); // Delay 2 detik setelah init

        // Periodic health check
        ConnectionMonitor.healthCheckInterval = setInterval(() => {
            if (navigator.onLine) {
                // Hanya lakukan health check jika browser online
                ConnectionMonitor.performHealthCheck();
            }
        }, APP_CONFIG.CONNECTION_CHECK_INTERVAL);
    },

    // Method untuk stop monitoring (untuk cleanup)
    stop: () => {
        if (ConnectionMonitor.healthCheckInterval) {
            clearInterval(ConnectionMonitor.healthCheckInterval);
            ConnectionMonitor.healthCheckInterval = null;
        }
    },
};

// Countdown Timer untuk Auto Refresh
const RefreshTimer = {
    countdown: APP_CONFIG.REFRESH_COUNTDOWN,
    interval: null,
    callbacks: [],

    onCountdownUpdate: (callback) => {
        RefreshTimer.callbacks.push(callback);
    },

    start: () => {
        RefreshTimer.stop();
        RefreshTimer.countdown = APP_CONFIG.REFRESH_COUNTDOWN;

        RefreshTimer.interval = setInterval(() => {
            RefreshTimer.countdown--;

            const countdownEl = document.getElementById("refresh-countdown");
            if (countdownEl) {
                if (RefreshTimer.countdown > 0) {
                    countdownEl.textContent = `Next refresh: ${RefreshTimer.countdown}s`;
                } else {
                    countdownEl.textContent = "Sedang refresh...";
                }
            }

            RefreshTimer.callbacks.forEach((callback) => callback(RefreshTimer.countdown));

            if (RefreshTimer.countdown <= 0) {
                RefreshTimer.countdown = APP_CONFIG.REFRESH_COUNTDOWN;
                setTimeout(() => {
                    if (countdownEl) {
                        countdownEl.textContent = `Next refresh: ${RefreshTimer.countdown}s`;
                    }
                }, 1000);
            }
        }, 1000);
    },

    stop: () => {
        if (RefreshTimer.interval) {
            clearInterval(RefreshTimer.interval);
            RefreshTimer.interval = null;
        }
    },

    reset: () => {
        RefreshTimer.countdown = APP_CONFIG.REFRESH_COUNTDOWN;
        const countdownEl = document.getElementById("refresh-countdown");
        if (countdownEl) {
            countdownEl.textContent = `Next refresh: ${RefreshTimer.countdown}s`;
        }
    },
};

// Export untuk global use
window.APP_CONFIG = APP_CONFIG;
window.API_CONFIG = API_CONFIG;
window.MESSAGES = MESSAGES;
window.DEFAULT_SWITCH_DATA = DEFAULT_SWITCH_DATA;
window.ENV = ENV;
window.Utils = Utils;
window.ApiHelper = ApiHelper;
window.StorageHelper = StorageHelper;
window.ConnectionMonitor = ConnectionMonitor;
window.RefreshTimer = RefreshTimer;

// Initialize saat DOM ready
$(document).ready(() => {
    console.log("DOM ready, initializing...");

    // Initialize connection monitoring
    ConnectionMonitor.init();

    // Initialize refresh timer hanya jika user sudah login
    if (StorageHelper.isAuthenticated()) {
        RefreshTimer.start();
    }

    // Check authentication untuk protected pages
    if (!window.location.pathname.includes("login.html") && !StorageHelper.isAuthenticated()) {
        window.location.href = "login.html";
        return;
    }

    // Add global error handler
    window.addEventListener("unhandledrejection", (event) => {
        console.error("Unhandled promise rejection:", event.reason);
        Utils.showNotification("Terjadi kesalahan yang tidak terduga", "error");
    });

    // Add global AJAX error handler
    $(document).ajaxError((event, xhr, settings, thrownError) => {
        if (xhr.status !== 401) {
            console.error("AJAX Error:", {
                url: settings.url,
                status: xhr.status,
                error: thrownError,
            });
        }
    });

    // Cleanup saat page unload
    window.addEventListener("beforeunload", () => {
        ConnectionMonitor.stop();
        RefreshTimer.stop();
    });
});
