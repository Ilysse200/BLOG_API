import { Router } from "express";
import authRouter from "./auth.routes";

import Blogrouter from "./blogRoutes";
const routes = Router()

routes.use('/users', authRouter)
routes.use('/blog', Blogrouter)

export default routes;