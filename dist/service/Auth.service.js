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
exports.AuthService = void 0;
// services/AuthService.ts
const database_1 = require("../config/database");
const User_1 = require("../entities/User");
const helpers_1 = require("../helpers/helpers");
const sendEmail_1 = require("../utils/sendEmail");
const typeorm_1 = require("typeorm");
const error_1 = require("../utils/error");
const crypto_1 = __importDefault(require("crypto"));
class AuthService {
    static register(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, email, password, role }) {
            if (!name || !email || !password) {
                throw { status: 400, message: "All fields are required" };
            }
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            const existingUser = yield userRepository.findOne({ where: { email } });
            if (existingUser) {
                throw new error_1.ConflictError("Email was registered in the database. Try a new one");
            }
            const hashedPassword = yield helpers_1.encrypt.encryptpass(password);
            const user = userRepository.create({ name, email, password: hashedPassword, role });
            yield userRepository.save(user);
            const token = helpers_1.encrypt.generateToken({ id: user.id, email: user.email, role: user.role });
            return user;
        });
    }
    //Create a service for deleting the user
    static deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            //Load the user table from the db
            const getUsers = database_1.AppDataSource.getRepository(User_1.User);
            //Check with id provided if the user exist
            const checkUser = yield getUsers.findOne({ where: { id } });
            if (!checkUser) {
                throw new error_1.NotFoundError("User with the provided id is");
            }
            //Delete the existing user
            yield getUsers.remove(checkUser);
            return checkUser;
        });
    }
    static login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = data;
            if (!email || !password) {
                throw { status: 400, message: "Email and password are required" };
            }
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            const user = yield userRepository.findOne({ where: { email } });
            if (!user) {
                throw new error_1.NotFoundError("User not found");
            }
            const isPasswordValid = yield helpers_1.encrypt.comparepassword(password, user.password);
            if (!isPasswordValid) {
                throw new error_1.ConflictError("Password is incorrect");
            }
            const token = helpers_1.encrypt.generateToken({
                id: user.id,
                email: user.email,
                role: user.role,
            });
            user.resetToken = token;
            return user;
        });
    }
    static getProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            const user = yield userRepository.findOne({ where: { id: userId } });
            if (!user) {
                throw new error_1.NotFoundError("User");
            }
            const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
            return userWithoutPassword;
        });
    }
    static forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email)
                throw { status: 400, message: "Email is required" };
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            const user = yield userRepository.findOne({ where: { email } });
            if (!user)
                throw { status: 404, message: "User not found" };
            const token = crypto_1.default.randomBytes(32).toString("hex");
            user.resetToken = token;
            user.resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
            const resetLink = `http://localhost:3000/reset-password/${token}`;
            yield (0, sendEmail_1.sendEmail)(user.email, "Reset Your Password", `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.</p>`);
            yield userRepository.save(user);
        });
    }
    static resetPassword(token, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!newPassword || newPassword.trim() === "") {
                throw { status: 400, message: "New password is required" };
            }
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            const user = yield userRepository.findOne({
                where: {
                    resetToken: token,
                    resetTokenExpiry: (0, typeorm_1.MoreThan)(new Date()),
                },
            });
            if (!user) {
                throw { status: 400, message: "Invalid or expired token" };
            }
            user.password = yield helpers_1.encrypt.encryptpass(newPassword);
            user.resetToken = null;
            user.resetTokenExpiry = null;
            yield userRepository.save(user);
        });
    }
}
exports.AuthService = AuthService;
