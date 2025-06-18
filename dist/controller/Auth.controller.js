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
exports.deleteUser = exports.login = exports.register = exports.AuthController = void 0;
const Auth_service_1 = require("../service/Auth.service");
const errorHandler_1 = require("../middleware/errorHandler");
class AuthController {
    // static async register(req: Request, res: Response) {
    //   try {
    //     const token = await AuthService.register(req.body);
    //     return res.status(201).json({ message: "User created", token });
    //   } catch (err: any) {
    //     return res.status(err.status || 500).json({ message: err.message || "Server error" });
    //   }
    // }
    // static async login(req: Request, res: Response) {
    //   try {
    //     const { token } = await AuthService.login(req.body);
    //     return res.status(200).json({ message: "Login successful", token });
    //   } catch (err: any) {
    //     return res.status(err.status || 500).json({ message: err.message || "Server error" });
    //   }
    // }
    static getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentUser = req.user;
                if (!currentUser) {
                    return res.status(401).json({
                        success: false,
                        message: "Profile not loaded successfully!!",
                    });
                }
                const user = yield Auth_service_1.AuthService.getProfile(currentUser.id);
                return res.status(200).json({
                    success: true,
                    message: "Profile loaded successfully!!",
                    data: {
                        name: user.name,
                        email: user.email,
                        role: user.role
                    }
                });
            }
            catch (err) {
                return res.status(err.status || 500).json({
                    success: false,
                    message: "Error loading Profile!!"
                });
            }
        });
    }
    static forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Auth_service_1.AuthService.forgotPassword(req.body.email);
                return res.status(200).json({ success: true, message: "Link sent to your email" });
            }
            catch (err) {
                return res.status(err.status || 500).json({ success: false, message: "Email was not found" });
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
exports.register = (0, errorHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield Auth_service_1.AuthService.register(req.body);
    res.status(201).json({
        success: true,
        message: "User registered successfully!!!",
        data: {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        }
    });
}));
exports.login = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield Auth_service_1.AuthService.login(req.body);
    res.status(200).json({
        success: true,
        message: 'User found in the database',
        data: {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: user.resetToken,
            }
        }
    });
}));
//Function to delete the user
exports.deleteUser = (0, errorHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deleteUser = yield Auth_service_1.AuthService.deleteUser(id);
    res.status(200).json({
        success: true,
        message: "User deleted successfully!!"
    });
}));
