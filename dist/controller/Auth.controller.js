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
exports.AuthController = void 0;
const Auth_service_1 = require("../service/Auth.service");
class AuthController {
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = yield Auth_service_1.AuthService.register(req.body);
                return res.status(201).json({ message: "User created", token });
            }
            catch (err) {
                return res.status(err.status || 500).json({ message: err.message || "Server error" });
            }
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = yield Auth_service_1.AuthService.login(req.body);
                return res.status(200).json({ message: "Login successful", token });
            }
            catch (err) {
                return res.status(err.status || 500).json({ message: err.message || "Server error" });
            }
        });
    }
    static getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentUser = req.currentUser;
                if (!currentUser) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                const user = yield Auth_service_1.AuthService.getProfile(currentUser.id);
                return res.status(200).json(user);
            }
            catch (err) {
                return res.status(err.status || 500).json({ message: err.message || "Server error" });
            }
        });
    }
    static forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Auth_service_1.AuthService.forgotPassword(req.body.email);
                return res.status(200).json({ message: "Reset link sent to email." });
            }
            catch (err) {
                return res.status(err.status || 500).json({ message: err.message || "Server error" });
            }
        });
    }
    static resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.params;
                const { newPassword } = req.body;
                yield Auth_service_1.AuthService.resetPassword(token, newPassword);
                return res.status(200).json({ message: "Password reset successfully." });
            }
            catch (err) {
                return res.status(err.status || 500).json({ message: err.message || "Server error" });
            }
        });
    }
}
exports.AuthController = AuthController;
