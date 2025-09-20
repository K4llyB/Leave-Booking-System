import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // tailwind v4: should contain `@import "tailwindcss";`

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
