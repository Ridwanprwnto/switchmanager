// utils/responseHelper.js
/**
 * Helper functions for consistent API responses
 */

const successResponse = (data, message = "Success") => {
    return {
        success: true,
        message,
        data,
        timestamp: new Date().toISOString(),
    };
};

const errorResponse = (error, code = null, statusCode = 500) => {
    const response = {
        success: false,
        error,
        timestamp: new Date().toISOString(),
    };

    if (code) {
        response.code = code;
    }

    return { response, statusCode };
};

const validationErrorResponse = (field, message) => {
    return {
        success: false,
        error: `Validation error: ${message}`,
        field,
        code: "VALIDATION_ERROR",
        timestamp: new Date().toISOString(),
    };
};

module.exports = {
    successResponse,
    errorResponse,
    validationErrorResponse,
};
