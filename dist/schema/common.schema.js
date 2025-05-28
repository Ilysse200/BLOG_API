"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nameSchema = exports.idParamSchema = exports.passwordSchema = exports.emailSchema = void 0;
const zod_1 = require("zod");
exports.emailSchema = zod_1.z.string()
    .email('Email format is not valid')
    .max(30, 'Email must be less than 30 characters');
exports.passwordSchema = zod_1.z.string()
    .min(8, "Pasword must be less tthan 8 characters")
    .max(255, "Password must be less than 255 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase letter, one uppercase letter, and one number");
exports.idParamSchema = zod_1.z.object({
    // id: z.string().regex(/^\d+$/, "ID must be a valid number").transform(Number),
    id: zod_1.z.string().uuid() //For ids that are UUIDS 
});
exports.nameSchema = zod_1.z.string();
