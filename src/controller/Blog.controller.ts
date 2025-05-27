import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import  {Blog } from "../entities/Blog";
import { User } from "../entities/User";
import { Any } from "typeorm";


export class blogController{
   static async createPost(req: Request, res: Response) {
  const { title, body } = req.body;
  const currentUser = (req as any).currentUser;

  const userRepo = AppDataSource.getRepository(User);
  const blogRepo = AppDataSource.getRepository(Blog);

  const author = await userRepo.findOneBy({ id: currentUser.id });
  if (!author) {
    return res.status(404).json({ message: "User not found" });
  }

  const post = blogRepo.create({ title, body, author });
  await blogRepo.save(post);

  res.status(201).json({ message: "Post created", post });
}
static async getAllPosts(req: Request, res: Response) {
  try {
    const blogRepo = AppDataSource.getRepository(Blog);
    const posts = await blogRepo.find({
      relations: ["author"], // include author details
      order: { createdAt: "DESC" }, // optional: newest first
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Failed to retrieve blog posts" });
  }
}

  static async updatePost(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, body } = req.body;
      const currentUser = (req as any).currentUser;

      const blogRepo = AppDataSource.getRepository(Blog);
      const post = await blogRepo.findOne({
        where: { id },
        relations: ["author"],
      });

      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      if (post.author.id !== currentUser.id) {
        return res.status(405).json({ message: "Unauthorized to update this post" });
      }

      post.title = title || post.title;
      post.body = body || post.body;

      await blogRepo.save(post);

      res.status(200).json({ message: "Post updated successfully", post });
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ message: "Failed to update post" });
    }
  }
  static async getPostById(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const blogRepo = AppDataSource.getRepository(Blog);
    const blog = await blogRepo.findOne({
      where: { id },
      relations: ["author"], 
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res.status(200).json(blog);
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    return res.status(500).json({ message: "Failed to fetch blog post" });
  }
}
//create an async function that will delete a blog by id

static async deleteBlog(req:Request, res:Response){

  //Provide the id for deleting
  const {id} = req.params;
  const blogFind = await AppDataSource.getRepository(Blog);//line that will retrieve the blog from the database
  const blog = await blogFind.findOne({
    where: {id},
    relations:["author"],
  });
  if(!blog){
    res.status(400)
    .json({message:'Blog Not found'});
  }
  blogFind.remove(blog as any, id as any);
  return res.status(200).
  json({message:'Blog deleted successfully!!'});
  }
}

