import { Request, Response } from "express";
import { BlogService } from "../service/Blog.service";

export class blogController {
  static async createPost(req: Request, res: Response) {
    try {
      const currentUser = (req as any).currentUser;
      const post = await BlogService.createPost(currentUser.id, req.body);
      return res.status(201).json({ message: "Post created", post });
    } catch (err: any) {
      return res.status(err.status || 500).json({ message: err.message || "Failed to create post" });
    }
  }

  static async getAllPosts(req: Request, res: Response) {
    try {
      const posts = await BlogService.getAllPosts();
      return res.status(200).json(posts);
    } catch (err: any) {
      return res.status(500).json({ message: err.message || "Failed to fetch posts" });
    }
  }

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
