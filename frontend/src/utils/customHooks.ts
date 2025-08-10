import { useEffect, useReducer, useState } from "react";
import productsReducer from "./productsReducer";
import type { Product } from "../types/types";
import { toast } from "react-toastify";

export default function useGetProducts(page: number) {
  const [products, dispatch] = useReducer(productsReducer, []);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    async function fetchProducts() {
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
    }

    fetchProducts().catch((err: unknown) => {
      console.error(err);
    });
  }, [page]);

  return [products, dispatch, pages] as const;
}
