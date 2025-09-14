// utils/validators.js
// IP Address validation regex
const IP_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

/**
 * Validate switch data structure
 */
const validateSwitchData = (datasource) => {
    if (!datasource) {
        return {
            success: false,
            error: "Data switch diperlukan",
            code: "DATASOURCE_MISSING",
        };
    }

    if (typeof datasource !== "object" || !datasource.name || !datasource.ip) {
        return {
            success: false,
            error: "Format data switch tidak valid (name dan ip diperlukan)",
            code: "DATASOURCE_INVALID",
        };
    }

    if (!IP_REGEX.test(datasource.ip)) {
        return {
            success: false,
            error: "Format IP address tidak valid",
            code: "INVALID_IP_FORMAT",
        };
    }

    // Validate children structure if exists
    if (datasource.ch && Array.isArray(datasource.ch)) {
        for (const channel of datasource.ch) {
            if (channel.ip && !IP_REGEX.test(channel.ip)) {
                return {
                    success: false,
                    error: `Format IP address tidak valid pada channel: ${channel.ip}`,
                    code: "INVALID_CHANNEL_IP_FORMAT",
                };
            }
        }
    }

    return null; // No validation errors
};

/**
 * Validate backup data structure
 */
const validateBackupData = (backup) => {
    if (!backup || !backup.datasource) {
        return {
            success: false,
            error: "Data backup tidak valid",
            code: "BACKUP_INVALID",
        };
    }

    // Use existing switch data validation
    return validateSwitchData(backup.datasource);
};

/**
 * Validate user ID format
 */
const validateUserId = (userId) => {
    if (!userId || typeof userId !== "string" || userId.trim().length === 0) {
        return {
            success: false,
            error: "User ID tidak valid",
            code: "INVALID_USER_ID",
        };
    }

    // Basic user ID format validation (alphanumeric with some special chars)
    const userIdRegex = /^[a-zA-Z0-9._-]+$/;
    if (!userIdRegex.test(userId.trim())) {
        return {
            success: false,
            error: "Format User ID tidak valid",
            code: "INVALID_USER_ID_FORMAT",
        };
    }

    return null; // No validation errors
};

module.exports = {
    validateSwitchData,
    validateBackupData,
    validateUserId,
    IP_REGEX,
};
