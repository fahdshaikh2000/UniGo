import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";

// Initialize Tempo Devtools
import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

// Get the root element
const rootElement = document.getElementById("root");

console.log(process.env.VITE_SUPABASE_URL);

// Check if root element exists
if (!rootElement) {
  console.error("Root element not found!");
} else {
  // Create root and render app
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>,
  );
}
