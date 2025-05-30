import { NextFunction, Request, Response } from "express";
import { BlogService } from "../service/Blog.service";
import { asyncHandler } from "../middleware/errorHandler";
import { createBlogInput } from "../schema/blog.schema";
import { ApiResponse, AuthenticatedRequest } from "../types/common.types";

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

  static async updatePost(req: Request, res: Response) {
    try {
      const currentUser = (req as any).currentUser;
      const updatedPost = await BlogService.updatePost(currentUser.id, req.params.id, req.body);
      return res.status(200).json({ message: "Post updated", updatedPost });
    } catch (err: any) {
      return res.status(err.status || 500).json({ message: err.message || "Failed to update post" });
    }
  }

  static async deletePost(req: Request, res: Response) {
    try {
      const currentUser = (req as any).currentUser;
      const result = await BlogService.deletePost(currentUser.id, req.params.id);
      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(err.status || 500).json({ message: err.message || "Failed to delete post" });
    }
  }
}



export const createPost = asyncHandler(async (
  req: AuthenticatedRequest & createBlogInput,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  const { title, body } = req.body;

  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const blog = await BlogService.createPost(req.user.id, { title, body });

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


