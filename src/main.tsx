import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import "./styles.css";
createRoot(document.getElementById("root")!).render(<RouterProvider router={getRouter()} />);
