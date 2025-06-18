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
exports.BlogService = void 0;
// services/BlogService.ts
const database_1 = require("../config/database");
const Blog_1 = require("../entities/Blog");
const User_1 = require("../entities/User");
const error_1 = require("../utils/error");
class BlogService {
    static createPost(currentUserId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, body } = data;
            const userRepo = database_1.AppDataSource.getRepository(User_1.User);
            const blogRepo = database_1.AppDataSource.getRepository(Blog_1.Blog);
            const author = yield userRepo.findOneBy({ id: currentUserId });
            if (!author)
                throw { status: 404, message: "User not found" };
            const post = blogRepo.create({ title, body, author });
            yield blogRepo.save(post);
            return post;
        });
    }
    static getAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            const blogRepo = database_1.AppDataSource.getRepository(Blog_1.Blog);
            const posts = yield blogRepo.find({
                relations: ["author"],
                order: { createdAt: "DESC" },
            });
            return posts;
        });
    }
    static getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogRepo = database_1.AppDataSource.getRepository(Blog_1.Blog);
            const post = yield blogRepo.findOne({
                where: { id },
                relations: ["author"],
            });
            if (!post)
                throw { status: 404, message: "Blog not found" };
            return post;
        });
    }
    static updatePost(currentUserId, id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogRepo = database_1.AppDataSource.getRepository(Blog_1.Blog);
            const post = yield blogRepo.findOne({
                where: { id },
                relations: ["author"],
            });
            if (!post)
                throw new error_1.FailedToFind("Blog");
            if (post.author.id !== currentUserId) {
                throw { status: 403, message: "Unauthorized to update this post" };
            }
            post.title = data.title || post.title;
            post.body = data.body || post.body;
            yield blogRepo.save(post);
            return post;
        });
    }
    static deletePost(currentUserId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogRepo = database_1.AppDataSource.getRepository(Blog_1.Blog);
            const post = yield blogRepo.findOne({
                where: { id },
                relations: ["author"],
            });
            if (!post)
                throw new error_1.FailedToFind("Blog not found");
            if (post.author.id !== currentUserId) {
                throw new error_1.ForbiddenError("Not enough privileges to preform this action!!");
            }
            yield blogRepo.remove(post);
            return { message: "Blog deleted successfully!" };
        });
    }
}
exports.BlogService = BlogService;
