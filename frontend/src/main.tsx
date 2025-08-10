import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import routes from "./routes/routes";
import "./globals/reset.css";
import "./globals/global.css";

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root") as HTMLDivElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
