import{z} from "zod"
import { idParamSchema } from "./common.schema"
import { nameSchema } from "./common.schema"
import { emailSchema } from "./common.schema"
import { passwordSchema } from "./common.schema"
export const createUserSchema = z.object(
    {
        body: z.object({
            name: nameSchema,
            email: emailSchema,
            password: passwordSchema,
            role: z.enum(["admin", "user"]).default('user')
        })
    }
)
export const loginUserSchema = z.object({
    body:z.object({
        email:emailSchema,
        password:passwordSchema
    })
})
export const updateUserSchema = z.object({
    params: idParamSchema,
    body: z.object({
        name:nameSchema.optional(),
        email:emailSchema.optional(),
        role:z.enum(["user", 'admin']).optional(),
        isActive:z.boolean().optional(),
    })
    .refine((data)=>Object.keys(data).length >0,{
        message:"At least one field must be provided for update"

    }),
})
export const deleteUserSchema = z.object({
    params:idParamSchema
})

export type CreateUserInput = z.infer<typeof createUserSchema>

export type UpdateUserInput = z.infer<typeof updateUserSchema>

export type DeleteUserInput = z.infer<typeof deleteUserSchema>