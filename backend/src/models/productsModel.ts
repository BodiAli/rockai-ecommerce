import { PrismaClient } from "@prisma/client";
import type Product from "../types/types.ts";

const prisma = new PrismaClient();

export async function getProducts(limit: number, offset: number) {
  const products = await prisma.product.findMany({
    take: limit,
    skip: offset,
    orderBy: {
      createdAt: "desc",
    },
  });

  return products;
}

export async function getProductsCount() {
  const count = await prisma.product.count();

  return count;
}

export async function getProduct(id: number) {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  return product;
}

export async function createProduct({ title, description, price, category, imgUrl, cloudId }: Product) {
  const createdProduct = await prisma.product.create({
    data: {
      title,
      description,
      price,
      category,
      imgUrl,
      cloudId,
    },
  });

  return createdProduct;
}

export async function updateProduct({ id, title, description, price, category, imgUrl, cloudId }: Product) {
  const updatedProduct = await prisma.product.update({
    data: {
      title,
      description,
      price,
      category,
      imgUrl,
      cloudId,
    },
    where: {
      id,
    },
  });

  return updatedProduct;
}

export async function deleteProduct(id: number) {
  await prisma.product.delete({
    where: {
      id,
    },
  });
}
