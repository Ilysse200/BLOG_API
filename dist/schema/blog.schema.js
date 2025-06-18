"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlogSchema = exports.createBlogSchema = void 0;
const zod_1 = require("zod");
const common_schema_1 = require("./common.schema");
const common_schema_2 = require("./common.schema");
exports.createBlogSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: common_schema_1.titleSchema,
        body: common_schema_2.bodySchema,
        // createdAt:createDate.optional(),
        // updatedAt:createDate.optional()
    })
    //  .refine(
    //   (data) =>
    //     !data.createdAt || !data.updatedAt || data.createdAt < data.updatedAt,
    //   {
    //     path: ["updatedAt"],
    //     message: "updatedAt must be after createdAt",
    //   }
    // ),
});
exports.updateBlogSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: common_schema_1.titleSchema.optional(),
        body: common_schema_2.bodySchema.optional(),
    })
        .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided for update"
    })
});
