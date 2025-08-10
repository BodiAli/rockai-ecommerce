import type { RouteObject } from "react-router";
import App from "../App";
import Home from "../pages/Home/Home";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import Cart from "../pages/Cart/Cart";
import Manage from "../pages/Manage/Manage";
import Notfound from "../pages/Notfound/Notfound";
import ErrorHandler from "../components/ErrorHandler/ErrorHandler";
import CreatePage from "../pages/CreatePage/CreatePage";

const routes: RouteObject[] = [
  {
    path: "/",
    Component: App,
    ErrorBoundary: Notfound,
    children: [
      {
        ErrorBoundary: ErrorHandler,
        children: [
          {
            index: true,
            Component: Home,
          },
          {
            path: "products/:productId",
            Component: ProductDetails,
          },
          {
            path: "cart",
            Component: Cart,
          },
          {
            path: "manage",
            Component: Manage,
          },
          {
            path: "manage/create",
            Component: CreatePage,
          },
        ],
      },
    ],
  },
];

export default routes;
