"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FailedToFind = exports.PasswordError = exports.ConflictError = exports.ForbiddenError = exports.UnauthorizedError = exports.NotFoundError = exports.ValidationError = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
class ValidationError extends AppError {
    constructor(errors, message = 'Validation failed') {
        super(message, 400);
        this.errors = errors;
    }
}
exports.ValidationError = ValidationError;
class NotFoundError extends AppError {
    constructor(resource = 'Resource') {
        super(`${resource} not found`, 404);
    }
}
exports.NotFoundError = NotFoundError;
class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized access') {
        super(message, 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends AppError {
    constructor(message = 'Access forbidden') {
        super(message, 403);
    }
}
exports.ForbiddenError = ForbiddenError;
class ConflictError extends AppError {
    constructor(message = 'Resource already exists') {
        super(message, 409);
    }
}
exports.ConflictError = ConflictError;
// Creating an error for when the password is incorrect
class PasswordError extends AppError {
    constructor(message = "Wrong Password") {
        super(message, 400);
    }
}
exports.PasswordError = PasswordError;
//For saying the blog is not found
class FailedToFind extends AppError {
    constructor(resource = 'Resource') {
        super(`${resource}`, 404);
    }
}
exports.FailedToFind = FailedToFind;
