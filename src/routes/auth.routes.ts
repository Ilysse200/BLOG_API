import * as express from 'express'
import { AuthController } from "../controller/Auth.controller";
import { authentification } from "../middleware/auth.middleware";

const Router = express.Router();

Router.post("/register",AuthController.register as any);
Router.post("/login", AuthController.login as any);
Router.get("/profile", authentification as any, AuthController.getProfile as any);

export default Router;
