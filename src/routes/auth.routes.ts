import * as express from 'express'
import { AuthController, register, login, deleteUser} from "../controller/auth.controller";
import { authentification } from "../middleware/auth.middleware";
import { validate } from '../middleware/validate.middleware';
import { createUserSchema, updateUserSchema, loginUserSchema, deleteUserSchema } from '../schema/user.schema';
import { authorizeRole } from '../middleware/authorization.middleware';

const authRouter = express.Router();

authRouter.post("/register",validate(createUserSchema),register);
authRouter.post("/login", validate(loginUserSchema),login as any);
authRouter.get("/profile",authentification as any,authorizeRole("admin"),AuthController.getProfile as any);
authRouter.delete("/delete/:id", validate(deleteUserSchema),authorizeRole("admin"),deleteUser)

//Routes for forgot password and reset tokens
authRouter.post("/forgot-password", AuthController.forgotPassword as any);
authRouter.post("/reset-password/:token",AuthController.resetPassword as any);
export default authRouter;
