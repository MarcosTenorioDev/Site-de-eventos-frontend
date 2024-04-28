import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { LangProvider } from "./assets/i18n/index.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <LangProvider>
        <App />
      </LangProvider>
  </React.StrictMode>
);
