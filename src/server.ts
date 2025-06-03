import { AppDataSource } from "./config/database";
import express, {Express} from 'express';
import * as dotenv from "dotenv";
import { Request, Response } from "express";
import "reflect-metadata";
import { errorHandler } from "./middleware/errorHandler";
import routes  from "./routes";
import swaggerUi from "swagger-ui-express"
import swaggerDocument from "./swagger-output.json"
dotenv.config();

const app = express();
app.use(express.json());
const { PORT = 3000 } = process.env;
app.use("/", routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(errorHandler);


app.get(/.*/, (req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

AppDataSource.initialize()
  .then(async () => {
    app.listen(PORT, () => {
      console.log("Server is running on http://localhost:" + PORT);
      console.log(`Documentation is running on http://localhost:${PORT}/api-docs'`)
    });
    console.log("Data Source has been initialized!");
  })
  .catch((error) => console.log(error));

export default app;