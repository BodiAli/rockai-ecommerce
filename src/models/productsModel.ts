import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export async function getProducts(limit: number, offset: number) {
  const products = await prisma.product.findMany({
    take: limit,
    skip: offset,
    omit: {
      cloudId: true,
    },
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

export async function createProduct(
  title: string,
  description: string,
  price: number,
  category: string,
  imgUrl: string,
  cloudId: string
) {
  const createdProduct = await prisma.product.create({
    data: {
      title,
      description,
      price,
      category,
      imgUrl,
      cloudId,
    },
    omit: {
      cloudId: true,
    },
  });

  return createdProduct;
}
