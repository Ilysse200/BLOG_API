import { AppDataSource } from "./config/database";
import express, {Express} from 'express';
import * as dotenv from "dotenv";
import { Request, Response } from "express";
import Router from "./routes/auth.routes";
import "reflect-metadata";
import { errorHandler } from "./middleware/errorHandler";
import blogRouter from "./routes/blogRoutes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(errorHandler);
const { PORT = 3000 } = process.env;
app.use("/auth", Router);
app.use("/blog", blogRouter);

app.get(/.*/, (req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

AppDataSource.initialize()
  .then(async () => {
    app.listen(PORT, () => {
      console.log("Server is running on http://localhost:" + PORT);
    });
    console.log("Data Source has been initialized!");
  })
  .catch((error) => console.log(error));