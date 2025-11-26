import { StrictMode } from "react"
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css'
import routes from "./routes";

const router = createBrowserRouter(routes);
createRoot(document.getElementById("root")).render(
  <div className="scale-wrapper">
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  </div>
);
