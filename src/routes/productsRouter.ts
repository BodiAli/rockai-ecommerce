import { Router } from "express";
import * as productsController from "../controllers/productsController.js";

const productsRouter = Router();

productsRouter.route("/products").get(productsController.getProducts).post(productsController.createProduct);
productsRouter
  .route("/products/:id")
  .get(productsController.getProduct)
  .put(productsController.updateProduct)
  .delete(productsController.deleteProduct);

export default productsRouter;
