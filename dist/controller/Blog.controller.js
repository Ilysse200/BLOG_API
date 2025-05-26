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
exports.blogController = void 0;
const database_1 = require("../config/database");
const Blog_1 = require("../entities/Blog");
const User_1 = require("../entities/User");
class blogController {
    static createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, body } = req.body;
            const currentUser = req.currentUser;
            const userRepo = database_1.AppDataSource.getRepository(User_1.User);
            const blogRepo = database_1.AppDataSource.getRepository(Blog_1.Blog);
            const author = yield userRepo.findOneBy({ id: currentUser.id });
            if (!author) {
                return res.status(404).json({ message: "User not found" });
            }
            const post = blogRepo.create({ title, body, author });
            yield blogRepo.save(post);
            res.status(201).json({ message: "Post created", post });
        });
    }
    static getAllPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blogRepo = database_1.AppDataSource.getRepository(Blog_1.Blog);
                const posts = yield blogRepo.find({
                    relations: ["author"], // include author details
                    order: { createdAt: "DESC" }, // optional: newest first
                });
                res.status(200).json(posts);
            }
            catch (error) {
                console.error("Error fetching posts:", error);
                res.status(500).json({ message: "Failed to retrieve blog posts" });
            }
        });
    }
}
exports.blogController = blogController;
