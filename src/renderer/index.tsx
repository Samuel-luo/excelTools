import React from "react";
import ReactDOM from "react-dom/client";
import { store } from "@/store";
import { RouterProvider, createHashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "@/views/App";
import CopyByKeywords from "@/views/CopyByKeywords";
import "./index.css";
import "antd/dist/antd.css";

const router = createHashRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/comparison_copy",
    element: <CopyByKeywords />
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <Provider store={store}>
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </Provider>
  </>
);

