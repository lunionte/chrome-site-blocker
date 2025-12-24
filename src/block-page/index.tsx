/**
 * Entry point da página de bloqueio
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { BlockPageApp } from "./components/App";
import "@/styles/globals.css";

const root = document.getElementById("root");

if (!root) {
    throw new Error("Root element not found");
}

ReactDOM.createRoot(root).render(
    <React.StrictMode>
        <BlockPageApp />
    </React.StrictMode>
);
