import * as express from 'express'
import { AuthController, register, login, deleteUser} from "../controller/auth.controller";
import { authentification } from "../middleware/auth.middleware";
import { validate } from '../middleware/validate.middleware';
import { createUserSchema, updateUserSchema, loginUserSchema, deleteUserSchema } from '../schema/user.schema';

const Router = express.Router();

Router.post("/register",validate(createUserSchema),register);
Router.post("/login", validate(loginUserSchema),login as any);
Router.get("/profile",authentification as any, AuthController.getProfile as any);
Router.delete("/delete/:id", validate(deleteUserSchema), deleteUser)

//Routes for forgot password and reset tokens
Router.post("/forgot-password", AuthController.forgotPassword as any);
Router.post("/reset-password/:token", AuthController.resetPassword as any);
export default Router;
