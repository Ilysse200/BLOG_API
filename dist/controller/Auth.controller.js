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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const database_1 = require("../config/database");
const User_1 = require("../entities/User");
const helpers_1 = require("../helpers/helpers");
const sendEmail_1 = require("../utils/sendEmail");
const typeorm_1 = require("typeorm");
const crypto_1 = __importDefault(require("crypto"));
class AuthController {
    //Register the user
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password, role } = req.body;
                if (!name || !email || !password) {
                    return res.status(400).json({ message: "All fields required" });
                }
                const userRepository = database_1.AppDataSource.getRepository(User_1.User);
                const existingUser = yield userRepository.findOne({ where: { email } });
                if (existingUser) {
                    return res.status(409).json({ message: "Email already in use" });
                }
                const hashedPassword = yield helpers_1.encrypt.encryptpass(password);
                const user = userRepository.create({ name, email, password: hashedPassword, role });
                yield userRepository.save(user);
                const token = helpers_1.encrypt.generateToken({ id: user.id, email: user.email, role: user.role });
                return res.status(201).json({ message: "User created", token });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ message: "Server error" });
            }
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    return res
                        .status(500)
                        .json({ message: " email and password required" });
                }
                const userRepository = database_1.AppDataSource.getRepository(User_1.User);
                const user = yield userRepository.findOne({ where: { email } });
                // ❗ FIX: Check user existence BEFORE using user.password
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                const isPasswordValid = helpers_1.encrypt.comparepassword(user.password, password);
                if (!user || !isPasswordValid) {
                    return res.status(404).json({ message: "User not found" });
                }
                const token = helpers_1.encrypt.generateToken({
                    id: user.id,
                    email: user.email,
                    role: user.role
                });
                const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
                return res.status(200).json({
                    message: "Login successful",
                    token,
                    user: userWithoutPassword
                });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    static getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = req.currentUser;
            if (!currentUser) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            const user = yield userRepository.findOne({
                where: { id: currentUser.id },
            });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
            return res.status(200).json(userWithoutPassword);
        });
    }
    //Forgot Password
    static forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                if (!email)
                    return res.status(400).json({ message: "Email required" });
                const userRepository = database_1.AppDataSource.getRepository(User_1.User);
                const user = yield userRepository.findOne({ where: { email } });
                if (!user)
                    return res.status(404).json({ message: "User not found" });
                const token = crypto_1.default.randomBytes(32).toString("hex");
                user.resetToken = token;
                user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
                yield userRepository.save(user);
                const resetLink = `http://localhost:3000/reset-password/${token}`;
                yield (0, sendEmail_1.sendEmail)(user.email, "Reset Your Password", `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.</p>`);
                res.status(200).json({ message: "Reset link sent to email." });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    static resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.params;
                const { newPassword } = req.body;
                const userRepository = database_1.AppDataSource.getRepository(User_1.User);
                const user = yield userRepository.findOne({
                    where: {
                        resetToken: token,
                        resetTokenExpiry: (0, typeorm_1.MoreThan)(new Date()),
                    },
                });
                if (!user)
                    return res.status(400).json({ message: "Invalid or expired token" });
                if (!newPassword || newPassword.trim() === "") {
                    return res.status(400).json({ message: "New password is required." });
                }
                user.password = yield helpers_1.encrypt.encryptpass(newPassword);
                user.resetToken = null;
                user.resetTokenExpiry = null;
                yield userRepository.save(user);
                res.status(200).json({ message: "Password reset successfully." });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
}
exports.AuthController = AuthController;
