import * as express from 'express'
import { blogController } from '../controller/Blog.controller';
import { authentification } from '../middleware/auth.middleware';
const Blogrouter = express.Router();


Blogrouter.post('/createBlogs', authentification as any, blogController.createPost as any);
Blogrouter.get('/getBlogs', authentification as any, blogController.getAllPosts as any)
Blogrouter.put('/editBlogs/:id', authentification as any, blogController.updatePost as any );
Blogrouter.get('/getBlogsById/:id', authentification as any, blogController.getPostById as any);
Blogrouter.delete('/deleteBlog/:id', authentification as any, blogController.deleteBlog as any)
export default Blogrouter;