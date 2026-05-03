import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

import { SavedPropertiesProvider } from "./context/SavedPropertiesContext";
import { AuthProvider } from "./context/AuthContext";

import "./styles/theme.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <SavedPropertiesProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SavedPropertiesProvider>
    </AuthProvider>
  </React.StrictMode>
);