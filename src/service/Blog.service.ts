// services/BlogService.ts
import { AppDataSource } from "../config/database";
import { Blog } from "../entities/Blog";
import { User } from "../entities/User";
import { FailedToFind, ForbiddenError, NotFoundError, UnauthorizedError } from "../utils/error";

export class BlogService {
  static async createPost(currentUserId: string, data: { title: string; body: string }) {
    const { title, body } = data;

    const userRepo = AppDataSource.getRepository(User);
    const blogRepo = AppDataSource.getRepository(Blog);

    const author = await userRepo.findOneBy({ id: currentUserId });
    if (!author) throw { status: 404, message: "User not found" };

    const post = blogRepo.create({ title, body, author });
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
    if (post.author.id !== currentUserId) {
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
    if (post.author.id !== currentUserId) {
      throw new ForbiddenError("Not enough privileges to preform this action!!");
    }

    await blogRepo.remove(post);
    return { message: "Blog deleted successfully!" };
  }
}
