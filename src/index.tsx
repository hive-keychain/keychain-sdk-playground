import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import ErrorPage from "./components/pages/error-page";
import DefaultCard from "./components/routes/default-cards";
import GetStarted from "./components/routes/get-started";
import RequestCard from "./components/routes/request-card";
import RootLayout from "./components/routes/root-layout";
import SwapWidgetCard from "./components/routes/swap-widget-card";
import "./index.css";

const router = createHashRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <DefaultCard />,
      },
      {
        path: "request/get-started",
        element: <GetStarted />,
      },
      {
        path: "request/:requestType",
        element: <RequestCard />,
      },
      {
        path: "swap-widget",
        element: <SwapWidgetCard />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
