import { useCallback, useEffect, useReducer, useState } from "react";
import productsReducer from "./productsReducer";
import type { Product } from "../types/types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export function useGetProducts(page: number) {
  const [products, dispatch] = useReducer(productsReducer, []);
  const [pages, setPages] = useState(1);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/products?page=${page}`);

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const { products, pages } = (await res.json()) as { products: Product[]; pages: number };

      dispatch({ type: "fetch-products", payload: products });
      setPages(pages);
    } catch {
      toast.error("Failed to fetch products");
    }
  }, [page]);

  useEffect(() => {
    fetchProducts().catch((err: unknown) => {
      console.error(err);
    });
  }, [page, fetchProducts]);

  return [products, dispatch, pages, fetchProducts] as const;
}

export function useGetProduct(path: string, id?: string) {
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/products/${id}`);

        if (!res.ok) {
          if (res.status === 404) {
            const { error } = (await res.json()) as { error: string };

            toast.error(error);

            void navigate(path, { viewTransition: true });
            return;
          }

          throw new Error("Failed to fetch product, please try again later.");
        }

        const { product } = (await res.json()) as { product: Product };

        setProduct(product);
      } catch {
        toast.error("Failed to fetch product, please try again later.");
        void navigate(path, { viewTransition: true, replace: true });
      }
    }

    void fetchProduct();
  }, [navigate, id, path]);

  return product;
}
