import { useState } from "react";
import { Outlet, useLocation } from "react-router";
import { ToastContainer } from "react-toastify";
import Header from "./components/Header/Header";
import { useGetProducts } from "./utils/customHooks";
import type { Product } from "./types/types";

export default function App() {
  const location = useLocation();

  const localStorageCart = localStorage.getItem("cart");

  const [cart, setCart] = useState<Product[]>(
    localStorageCart ? (JSON.parse(localStorageCart) as Product[]) : []
  );

  const queryString = new URLSearchParams(location.search);
  const currentPage = Number.parseInt(queryString.get("page") ?? "1");

  const [products, dispatch, pages, fetchProducts] = useGetProducts(currentPage);

  return (
    <>
      <Header />
      <Outlet context={{ products, pages, dispatch, currentPage, fetchProducts, cart, setCart }} />
      <ToastContainer hideProgressBar />
    </>
  );
}
