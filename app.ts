import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import productsRouter from "./src/routes/productsRouter.js";

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/api", productsRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Resource not found" });
});

app.use((error: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  res.status(500).json({ error: error.message ? error.message : error });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}!`);
});
