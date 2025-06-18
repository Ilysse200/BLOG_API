"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNewPassword = exports.deleteUserSchema = exports.updateUserSchema = exports.loginUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
const common_schema_1 = require("./common.schema");
const common_schema_2 = require("./common.schema");
const common_schema_3 = require("./common.schema");
const common_schema_4 = require("./common.schema");
exports.createUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: common_schema_2.nameSchema,
        email: common_schema_3.emailSchema,
        password: common_schema_4.passwordSchema,
        role: zod_1.z.enum(["admin", "user"]).default('user')
    })
});
exports.loginUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: common_schema_3.emailSchema,
        password: common_schema_4.passwordSchema
    })
});
exports.updateUserSchema = zod_1.z.object({
    params: common_schema_1.idParamSchema,
    body: zod_1.z.object({
        name: common_schema_2.nameSchema.optional(),
        email: common_schema_3.emailSchema.optional(),
        role: zod_1.z.enum(["user", 'admin']).optional(),
        isActive: zod_1.z.boolean().optional(),
    })
        .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided for update"
    }),
});
exports.deleteUserSchema = zod_1.z.object({
    params: common_schema_1.idParamSchema
});
exports.updateNewPassword = zod_1.z.object({
    newPassword: common_schema_4.passwordSchema
});
