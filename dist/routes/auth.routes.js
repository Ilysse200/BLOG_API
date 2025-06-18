"use strict";
/**
 * @swagger
 * /users/register:
 * post:
 * summary:User registration
 * description:Receives the user credentials and save them to the database
 * tags:
 *  -Auth
 * requestBody:
 *  required:true
 *  content:
 *   application/json:
 *    schema:
 *     type:object
 *     required:
 *      -name
 *      -email
 *      -password
 *      -role
 *      properties:
 *       success:
 *         type:boolean
 *         example:true
 *       code:
 *        type:integer
 *        example:201
 *        message:
 *        type:string
 *        example:User registered successfully!!
 *       400:
 *         description: Registration failed. An error occured.Check for validation!!
 *
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const auth_controller_1 = require("../controller/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const user_schema_1 = require("../schema/user.schema");
const authorization_middleware_1 = require("../middleware/authorization.middleware");
const authRouter = express.Router();
authRouter.post("/register", (0, validate_middleware_1.validate)(user_schema_1.createUserSchema), auth_controller_1.register);
authRouter.post("/login", (0, validate_middleware_1.validate)(user_schema_1.loginUserSchema), auth_controller_1.login);
authRouter.get("/profile", auth_middleware_1.authentification, (0, authorization_middleware_1.authorizeRole)("admin"), auth_controller_1.AuthController.getProfile);
authRouter.delete("/delete/:id", (0, validate_middleware_1.validate)(user_schema_1.deleteUserSchema), (0, authorization_middleware_1.authorizeRole)("admin"), auth_controller_1.deleteUser);
//Routes for forgot password and reset tokens
authRouter.post("/forgot-password", auth_controller_1.AuthController.forgotPassword);
authRouter.post("/reset-password/:token", auth_controller_1.AuthController.resetPassword);
exports.default = authRouter;
