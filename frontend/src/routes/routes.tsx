import type { RouteObject } from "react-router";
import App from "../App";
import Home from "../pages/Home/Home";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import Cart from "../pages/Cart/Cart";
import Manage from "../pages/Manage/Manage";
import CreatePage from "../pages/CreatePage/CreatePage";
import UpdatePage from "../pages/UpdatePage/UpdatePage";
import Notfound from "../pages/Notfound/Notfound";
import ErrorHandler from "../components/ErrorHandler/ErrorHandler";

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
            path: "products/:id",
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
          {
            path: "manage/update/:id",
            Component: UpdatePage,
          },
        ],
      },
    ],
  },
];

export default routes;
