import { NextFunction, Request, RequestHandler, Response } from "express";
import { body, matchedData, query, validationResult } from "express-validator";
import multer from "multer";
import fs from "node:fs/promises";
import * as productsModel from "../models/productsModel.js";
import validationErrors from "./validationErrors.js";
import cloudinary from "../config/cloudinaryConfig.js";
import type Product from "../types/types.ts";

const upload = multer({ dest: "uploads" });

const validatePageQuery = [
  query("page").customSanitizer(async (value: string) => {
    const valueInt = Number.parseInt(value);

    if (valueInt <= 0 || Number.isNaN(valueInt)) {
      return 1;
    }

    const totalProductsCount = await productsModel.getProductsCount();

    const productsLimit = 5;

    const totalPages = Math.ceil(totalProductsCount / productsLimit) || 1;

    if (valueInt > totalPages) {
      return totalPages;
    }

    return valueInt;
  }),
];

export const getProducts = [
  validatePageQuery,
  async (req: Request, res: Response) => {
    const { page } = matchedData<{ page: number }>(req, { locations: ["query"] });

    const productsLimit = 5;

    const offset = (page - 1) * productsLimit;

    const products = await productsModel.getProducts(productsLimit, offset);

    const totalProductsCount = await productsModel.getProductsCount();
    const pages = Math.ceil(totalProductsCount / productsLimit) || 1;

    res.status(200).json({ products, pages });
  },
] as RequestHandler[];

export const getProduct = async (req: Request<{ id: string }>, res: Response) => {
  const id = Number.parseInt(req.params.id);

  const product = await productsModel.getProduct(id);

  if (!product) {
    res
      .status(404)
      .json({ error: "Product not found! it may have been moved, deleted, or it might have never existed." });
    return;
  }

  res.status(200).json({ product });
};

const validateProduct = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage(`Title ${validationErrors.emptyErr}`)
    .isLength({ max: 255 })
    .withMessage(`Title ${validationErrors.maxLengthErr255}`),
  body("description").trim().notEmpty().withMessage(`Description ${validationErrors.emptyErr}`),
  body("price")
    .trim()
    .notEmpty()
    .withMessage(`Price ${validationErrors.emptyErr}`)
    .isNumeric({ no_symbols: true })
    .withMessage(validationErrors.priceError)
    .isLength({ max: 10 })
    .withMessage(validationErrors.priceError)
    .isDecimal({ decimal_digits: "2", force_decimal: false })
    .withMessage(validationErrors.priceError),
  body("category")
    .trim()
    .notEmpty()
    .withMessage(`Category ${validationErrors.emptyErr}`)
    .isLength({ max: 100 })
    .withMessage(`Category ${validationErrors.maxLengthErr100}`),
];

export const createProduct = [
  upload.single("productImage"),
  validateProduct,
  body("productImage").custom(async (value, { req }) => {
    const mReq = req as Request & { file: Express.Multer.File | undefined };

    if (!mReq.file) {
      throw new Error("File cannot be empty");
    }

    if (mReq.file.size > 3145728) {
      await fs.rm(mReq.file.path);
      throw new Error("File cannot be larger than 3MB.");
    } else if (!mReq.file.mimetype.startsWith("image/")) {
      await fs.rm(mReq.file.path);
      throw new Error("File uploaded is not of type image.");
    } else if (mReq.file.size === 0) {
      await fs.rm(mReq.file.path);
      throw new Error("File cannot be empty.");
    }
    return true;
  }),
  async (
    req: Request<object, object, Product> & { file: Express.Multer.File },
    res: Response,
    next: NextFunction
  ) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    let cloudId: string;
    let imgUrl: string;

    try {
      const { secure_url: url, public_id: id } = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
        format: "jpg",
      });
      imgUrl = url;
      cloudId = id;
    } catch (err) {
      await fs.rm(req.file.path);
      next(err);
      return;
    } finally {
      await fs.rm(req.file.path);
    }

    const { title, description, price, category } = req.body;

    const createdProduct = await productsModel.createProduct({
      title,
      description,
      price,
      category,
      imgUrl,
      cloudId,
    });

    res.status(201).json({ msg: "Product created successfully!", createdProduct });
  },
] as RequestHandler[];

export const updateProduct = [
  upload.single("productImage"),
  validateProduct,
  body("productImage")
    .optional({ values: "falsy" })
    .custom(async (value, { req }) => {
      const mReq = req as Request & { file: Express.Multer.File | undefined };

      if (!mReq.file) {
        return true;
      }

      if (mReq.file.size > 3145728) {
        await fs.rm(mReq.file.path);
        throw new Error("File cannot be larger than 3MB.");
      } else if (!mReq.file.mimetype.startsWith("image/")) {
        await fs.rm(mReq.file.path);
        throw new Error("File uploaded is not of type image.");
      } else if (mReq.file.size === 0) {
        await fs.rm(mReq.file.path);
        throw new Error("File cannot be empty.");
      }
      return true;
    }),
  async (
    req: Request<{ id: string }, object, Product> & { file: Express.Multer.File | undefined },
    res: Response,
    next: NextFunction
  ) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      if (req.file) {
        await fs.rm(req.file.path);
      }
      return;
    }

    const id = Number.parseInt(req.params.id);

    const product = await productsModel.getProduct(id);

    if (!product) {
      res.status(404).json({
        error: "Product not found! it may have been moved, deleted or it might have never existed.",
      });

      if (req.file) {
        await fs.rm(req.file.path);
      }
      return;
    }

    let { cloudId } = product;
    let { imgUrl } = product;

    if (req.file) {
      try {
        const { result } = (await cloudinary.uploader.destroy(cloudId, { resource_type: "image" })) as {
          result: string;
        };

        if (result !== "ok") {
          throw new Error("Error updating product, please try again later.");
        }

        const { secure_url: url, public_id: id } = await cloudinary.uploader.upload(req.file.path, {
          resource_type: "image",
          format: "jpg",
        });

        imgUrl = url;
        cloudId = id;
      } catch (err) {
        await fs.rm(req.file.path);
        next(err);
        return;
      } finally {
        await fs.rm(req.file.path);
      }
    }

    const { title, description, price, category } = req.body;

    const createdProduct = await productsModel.updateProduct({
      id,
      title,
      description,
      price,
      category,
      imgUrl,
      cloudId,
    });

    res.status(200).json({ msg: "Product updated successfully!", createdProduct });
  },
] as RequestHandler[];

export const deleteProduct = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  const id = Number.parseInt(req.params.id);
  const product = await productsModel.getProduct(id);

  if (!product) {
    res
      .status(404)
      .json({ error: "Product not found! it may have been moved, deleted or it might have never existed." });
    return;
  }

  try {
    const { result } = (await cloudinary.uploader.destroy(product.cloudId, { resource_type: "image" })) as {
      result: string;
    };

    if (result !== "ok") {
      throw new Error("Error deleting product, please try again later.");
    }
  } catch (err) {
    next(err);
    return;
  }

  await productsModel.deleteProduct(id);

  res.sendStatus(204);
};
