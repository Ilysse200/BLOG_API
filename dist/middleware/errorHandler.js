"use strict";
// src/middleware/errorHandler.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Something went wrong';
    console.error(`[Error] ${status} - ${message}`);
    if (status === 500) {
        console.error(err.stack);
    }
    res.status(status).json({
        error: {
            message,
            code: err.code || 'INTERNAL_SERVER_ERROR',
            status
        }
    });
};
exports.errorHandler = errorHandler;
