import { Router } from "express";
import * as productsController from "../controllers/productsController.js";

const productsRouter = Router();

productsRouter.route("/products").get(productsController.getProducts).post(productsController.createProduct);

export default productsRouter;
