import {date, z} from "zod";

export const emailSchema  = z.string()
.email('Email format is not valid')
.max(30, 'Email must be less than 30 characters');

export const passwordSchema = z.string()
.min(8, "Pasword must be less tthan 8 characters")
.max(255, "Password must be less than 255 characters")
.regex(  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one lowercase letter, one uppercase letter, and one number"
  );
export const idParamSchema = z.object({
    // id: z.string().regex(/^\d+$/, "ID must be a valid number").transform(Number),
    id:z.string().uuid()//For ids that are UUIDS 
})
export const nameSchema = z.string();

export const titleSchema = z.string()
.min(10, "The least characters should be 10 characters for the title")
.max(40, "The title shoul not go above 40 characters")

export const  bodySchema = z.string()
.min(50, "The least amount of characters should be 50")
.max(255, "Do not go above 255 characters while writing your blog")


// export const createDate = z.string()
// .refine(
//   (val)=>!isNaN(Date.parse(val)), //Will receive string and check if it's a date
//   {message:"Date format is not valid"}
// )
// .transform((val)=>new Date(val));//Convert to date


