import * as express from 'express'
import {createPost, deleteBlogController, getAllPosts, blogController} from "../controller/Blog.controller"
import { authentification } from '../middleware/auth.middleware';
import { authorizeRole } from '../middleware/authorization.middleware';
// import { validate } from '../middleware/validate.middleware';
// import { createBlogSchema } from '../schema/blog.schema';
const Blogrouter = express.Router();


Blogrouter.post('/createBlogs',createPost);
Blogrouter.get('/getBlogs', getAllPosts as any)
// Blogrouter.put('/editBlogs/:id', authentification as any, blogController.updatePost as any );
Blogrouter.get('/getBlogsById/:id', blogController.getPostById as any);
Blogrouter.delete('/deleteBlog/:id',deleteBlogController)
export default Blogrouter;