import { Outlet, useLocation } from "react-router";
import { ToastContainer } from "react-toastify";
import Header from "./components/Header/Header";
import useGetProducts from "./utils/customHooks";

export default function App() {
  const location = useLocation();

  const queryString = new URLSearchParams(location.search);
  const currentPage = Number.parseInt(queryString.get("page") ?? "1");

  const [products, dispatch, pages] = useGetProducts(currentPage);

  return (
    <>
      <Header />
      <Outlet context={{ products, pages, dispatch, currentPage }} />
      <ToastContainer hideProgressBar />
    </>
  );
}
