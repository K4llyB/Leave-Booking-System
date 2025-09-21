import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import ErrorBoundary from "./ErrorBoundary";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

import { AuthProvider } from "./auth";                    
import { ToastProvider } from "./components/ToastProvider"; 

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>             
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
