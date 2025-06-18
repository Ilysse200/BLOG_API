"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlogController = exports.getAllPosts = exports.createPost = exports.blogController = void 0;
const Blog_service_1 = require("../service/Blog.service");
const errorHandler_1 = require("../middleware/errorHandler");
class blogController {
    // static async createPost(req: Request, res: Response) {
    //   try {
    //     const currentUser = (req as any).currentUser;
    //     const post = await BlogService.createPost(currentUser.id, req.body);
    //     return res.status(201).json({ message: "Post created", post });
    //   } catch (err: any) {
    //     return res.status(err.status || 500).json({ message: err.message || "Failed to create post" });
    //   }
    // }
    // static async getAllPosts(req: Request, res: Response) {
    //   try {
    //     const posts = await BlogService.getAllPosts();
    //     return res.status(200).json(posts);
    //   } catch (err: any) {
    //     return res.status(500).json({ message: err.message || "Failed to fetch posts" });
    //   }
    // }
    static getPostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield Blog_service_1.BlogService.getPostById(req.params.id);
                return res.status(200).json(post);
            }
            catch (err) {
                return res.status(err.status || 500).json({ message: err.message || "Failed to fetch post" });
            }
        });
    }
    static updatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentUser = req.user;
                const updatedPost = yield Blog_service_1.BlogService.updatePost(currentUser.id, req.params.id, req.body);
                return res.status(200).json({ success: true, message: "Post updated" });
            }
            catch (err) {
                return res.status(err.status || 500).json({ success: false, message: "An error occured while updating blog!!" });
            }
        });
    }
}
exports.blogController = blogController;
exports.createPost = (0, errorHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, body } = req.body;
    if (!req.user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const blog = yield Blog_service_1.BlogService.createPost(req.user.id, { title, body });
    return res.status(201).json({
        success: true,
        message: "Blog created successfully",
        data: blog,
    });
}));
exports.getAllPosts = (0, errorHandler_1.asyncHandler)((req, // no auth needed for viewing all posts
res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield Blog_service_1.BlogService.getAllPosts();
    return res.status(200).json({
        success: true,
        message: "All blog posts retrieved successfully",
        data: posts,
    });
}));
//Delete Blog
exports.deleteBlogController = (0, errorHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!req.user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const result = yield Blog_service_1.BlogService.deletePost(req.user.id, id);
    return res.status(200).json({
        success: true,
        message: "Blog deleted successfully",
        data: result,
    });
}));
// export const updateBlog = asyncHandler(async(
//   req:AuthenticatedRequest & up,
// )=>{
// }
// )
