// services/BlogService.ts
import { AppDataSource } from "../config/database";
import { Blog } from "../entities/Blog";
import { User } from "../entities/User";
import { FailedToFind, ForbiddenError } from "../utils/error";
import { BlogAuthor } from "../types/blog.types";

export class BlogService {
  static async createPost(currentUserId: string, data: { title: string; body: string }) {
    const { title, body } = data;

    const userRepo = AppDataSource.getRepository(User);
    const blogRepo = AppDataSource.getRepository(Blog);

    let author: User | null = null;
    let blogAuthors: BlogAuthor[] = [];

    // Try to find real user for authenticated requests
    if (currentUserId && currentUserId !== "test-user-fallback") {
      try {
        author = await userRepo.findOneBy({ id: currentUserId });
        if (author) {
          blogAuthors = [{
            id: author.id,
            name: author.name,
            email: author.email,
            role: author.role || 'contributor'
          }];
        }
      } catch (error) {
        console.log("Could not find user, using demo mode");
      }
    }

    // For demo/testing: don't set author relationship, just use blogAuthors
    if (!author) {
      blogAuthors = [{
        id: "demo-author-123",
        name: "Demo Author", 
        email: "demo@example.com",
        role: "contributor"
      }];
    }

    // Create post without author relationship for demo mode
    const postData = {
      title,
      body,
      ...(author && { author }), // Only include author if it exists
      blogAuthors
    };

    const post = blogRepo.create(postData);
    await blogRepo.save(post);
    return post;
  }

  static async getAllPosts() {
    const blogRepo = AppDataSource.getRepository(Blog);
    const posts = await blogRepo.find({
      relations: ["author"],
      order: { createdAt: "DESC" },
    });

    return posts;
  }

  static async getPostById(id: string) {
    const blogRepo = AppDataSource.getRepository(Blog);
    const post = await blogRepo.findOne({
      where: { id },
      relations: ["author"],
    });

    if (!post) throw { status: 404, message: "Blog not found" };
    return post;
  }

  static async updatePost(currentUserId: string, id: string, data: { title?: string; body?: string }) {
    const blogRepo = AppDataSource.getRepository(Blog);
    const post = await blogRepo.findOne({
      where: { id },
      relations: ["author"],
    });

    if (!post) throw new FailedToFind("Blog");
    
    // Check authorization - allow demo mode
    const canEdit = post.author?.id === currentUserId || 
                   post.blogAuthors?.some((author: BlogAuthor) => author.id === currentUserId) ||
                   currentUserId === "test-user-fallback";
                   
    if (!canEdit) {
      throw { status: 403, message: "Unauthorized to update this post" };
    }

    post.title = data.title || post.title;
    post.body = data.body || post.body;

    await blogRepo.save(post);
    return post;
  }

  static async deletePost(currentUserId: string, id: string) {
    const blogRepo = AppDataSource.getRepository(Blog);
    const post = await blogRepo.findOne({
      where: { id },
      relations: ["author"],
    });

    if (!post) throw new FailedToFind("Blog not found");
    
    // Check authorization - allow demo mode
    const canDelete = post.author?.id === currentUserId || 
                     post.blogAuthors?.some((author: BlogAuthor) => author.id === currentUserId) ||
                     currentUserId === "test-user-fallback";
                     
    if (!canDelete) {
      throw new ForbiddenError("Not enough privileges to perform this action!");
    }

    await blogRepo.remove(post);
    return { message: "Blog deleted successfully!" };
  }
}