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
const Blog_service_1 = require("../service/Blog.service");
class blogController {
    static createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentUser = req.currentUser;
                const post = yield Blog_service_1.BlogService.createPost(currentUser.id, req.body);
                return res.status(201).json({ message: "Post created", post });
            }
            catch (err) {
                return res.status(err.status || 500).json({ message: err.message || "Failed to create post" });
            }
        });
    }
    static getAllPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield Blog_service_1.BlogService.getAllPosts();
                return res.status(200).json(posts);
            }
            catch (err) {
                return res.status(500).json({ message: err.message || "Failed to fetch posts" });
            }
        });
    }
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
                const currentUser = req.currentUser;
                const updatedPost = yield Blog_service_1.BlogService.updatePost(currentUser.id, req.params.id, req.body);
                return res.status(200).json({ message: "Post updated", updatedPost });
            }
            catch (err) {
                return res.status(err.status || 500).json({ message: err.message || "Failed to update post" });
            }
        });
    }
    static deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentUser = req.currentUser;
                const result = yield Blog_service_1.BlogService.deletePost(currentUser.id, req.params.id);
                return res.status(200).json(result);
            }
            catch (err) {
                return res.status(err.status || 500).json({ message: err.message || "Failed to delete post" });
            }
        });
    }
}
exports.blogController = blogController;
