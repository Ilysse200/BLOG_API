import * as express from 'express'
import { AuthController, register, login } from "../controller/auth.controller";
import { authentification } from "../middleware/auth.middleware";
import { validate } from '../middleware/validate.middleware';
import { createUserSchema, updateUserSchema, loginUserSchema } from '../schema/user.schema';

const Router = express.Router();

Router.post("/register",validate(createUserSchema),register);
Router.post("/login", validate(loginUserSchema),login as any);
Router.get("/profile",authentification as any, AuthController.getProfile as any);

//Routes for forgot password and reset tokens
Router.post("/forgot-password", AuthController.forgotPassword as any);
Router.post("/reset-password/:token", AuthController.resetPassword as any);
export default Router;
