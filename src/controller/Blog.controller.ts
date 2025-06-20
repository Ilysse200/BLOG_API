import { NextFunction, Request, Response } from "express";
import { BlogService } from "../service/Blog.service";
import { asyncHandler } from "../middleware/errorHandler";
import { createBlogInput } from "../schema/blog.schema";
import { ApiResponse, AuthenticatedRequest } from "../types/common.types";
import { UnauthorizedError } from "../utils/error";
import { updateBlogSchema } from "../schema/blog.schema";
export class blogController {
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

  static async getPostById(req: Request, res: Response) {
    try {
      const post = await BlogService.getPostById(req.params.id);
      return res.status(200).json(post);
    } catch (err: any) {
      return res.status(err.status || 500).json({ message: err.message || "Failed to fetch post" });
    }
  }

  static async updatePost(req: AuthenticatedRequest, res: Response<ApiResponse>) {
    try {
      const currentUser = (req as any).user;
      const updatedPost = await BlogService.updatePost(currentUser.id, req.params.id, req.body);
      return res.status(200).json({ success:true,message: "Post updated"});
    } catch (err: any) {
      return res.status(err.status || 500).json({success:false, message: "An error occured while updating blog!!"});
    }
  }

  // static async deletePost(req: Request, res: Response) {
  //   try {
  //     const currentUser = (req as any).currentUser;
  //     const result = await BlogService.deletePost(currentUser.id, req.params.id);
  //     return res.status(200).json(result);
  //   } catch (err: any) {
  //     return res.status(err.status || 500).json({ message: err.message || "Failed to delete post" });
  //   }
  // }
}



export const createPost = asyncHandler(async (
  req: AuthenticatedRequest & createBlogInput,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  const { title, body } = req.body;

  // Use fallback ID for demo/testing when no authenticated user
  const currentUserId = req.user?.id || "test-user-fallback";

  const blog = await BlogService.createPost(currentUserId, { title, body });

  return res.status(201).json({
    success: true,
    message: "Blog created successfully",
    data: blog,
  });
});

export const getAllPosts = asyncHandler(async (
  req: Request, // no auth needed for viewing all posts
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  const posts = await BlogService.getAllPosts();

  return res.status(200).json({
    success: true,
    message: "All blog posts retrieved successfully",
    data: posts,
  });
});

//Delete Blog
export const deleteBlogController = asyncHandler(async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
) => {

  const{id} = req.params;
   if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  const result = await BlogService.deletePost(req.user.id,id);

  return res.status(200).json({
    success: true,
    message: "Blog deleted successfully",
    data: result,
  });
});

// export const updateBlog = asyncHandler(async(
//   req:AuthenticatedRequest & up,

// )=>{

// }
// )


