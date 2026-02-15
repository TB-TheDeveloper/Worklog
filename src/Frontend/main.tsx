import "./style.css";
import App from "./App";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import MenuBar from "./MenuBar";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <MenuBar />
      <App />
    </BrowserRouter>
  </StrictMode>,
);
