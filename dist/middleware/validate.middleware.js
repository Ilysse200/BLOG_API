"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateData = exports.validate = void 0;
const zod_1 = require("zod");
const error_1 = require("../utils/error");
const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errors = {};
                error.errors.forEach((err) => {
                    const path = err.path.slice(1).join('.');
                    if (!errors[path]) {
                        errors[path] = [];
                    }
                    errors[path].push(err.message);
                });
                next(new error_1.ValidationError(errors));
            }
            else {
                next(error);
            }
        }
    };
};
exports.validate = validate;
//function that will help us validate out data 
const validateData = (schema, data) => {
    try {
        return schema.parse(data);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const errors = {};
            error.errors.forEach((err) => {
                const path = err.path.join('.');
                if (!errors[path]) {
                    errors[path] = [];
                }
                errors[path].push(err.message);
            });
            throw new error_1.ValidationError(errors);
        }
        throw error;
    }
};
exports.validateData = validateData;
