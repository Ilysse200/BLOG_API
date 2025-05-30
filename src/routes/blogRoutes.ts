import * as express from 'express'
import {createPost, deleteBlogController, getAllPosts, blogController} from "../controller/Blog.controller"
import { authentification } from '../middleware/auth.middleware';
import { authorizeRole } from '../middleware/authorization.middleware';
import { validate } from '../middleware/validate.middleware';
import { createBlogSchema } from '../schema/blog.schema';
const Blogrouter = express.Router();


Blogrouter.post('/createBlogs', authentification as any,validate(createBlogSchema), createPost);
Blogrouter.get('/getBlogs', authentification as any, getAllPosts as any)
// Blogrouter.put('/editBlogs/:id', authentification as any, blogController.updatePost as any );
Blogrouter.get('/getBlogsById/:id', authentification as any, blogController.getPostById as any);
Blogrouter.delete('/deleteBlog/:id', authentification as any,authorizeRole("admin") as any, deleteBlogController)
export default Blogrouter;