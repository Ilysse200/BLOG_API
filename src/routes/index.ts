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
import { Router } from "express";
import authRouter from "./auth.routes";

import Blogrouter from "./blogRoutes";
const routes = Router()

routes.use('/users', authRouter)
routes.use('/blog', Blogrouter)

export default routes;