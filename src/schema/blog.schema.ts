import {z} from "zod"
import {titleSchema } from "./common.schema"
import { bodySchema } from "./common.schema"
export const createBlogSchema = z.object({
    body:z.object({
        title:titleSchema,
        body: bodySchema,
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
}    
)

export const updateBlogSchema = z.object({
    body:z.object({
        title:titleSchema.optional(),
        body:bodySchema.optional(),
    })
    .refine((data)=>Object.keys(data).length > 0,{
        message:"At least one field must be provided for update"
    })
})
export type createBlogInput = z.infer<typeof createBlogSchema>
export type updateBlogInput = z.infer<typeof updateBlogSchema>