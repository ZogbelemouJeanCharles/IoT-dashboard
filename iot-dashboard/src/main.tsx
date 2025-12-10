import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./dashboard";
import SensorsPage from "./pages/SensorsPage";
import ActuatorsPage from "./pages/ActuatorsPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";

const router = createBrowserRouter([
  { path: "/", element: <Dashboard /> },
  { path: "/sensors", element: <SensorsPage /> },
  { path: "/actuators", element: <ActuatorsPage /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

