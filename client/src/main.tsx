import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { PropertiesProvider } from "./context/PropertiesContext";
import { SavedPropertiesProvider } from "./context/SavedPropertiesContext";

import "./styles/theme.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PropertiesProvider>
          <SavedPropertiesProvider>
            <App />
          </SavedPropertiesProvider>
        </PropertiesProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
