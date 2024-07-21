// client/src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/style/bootstrap.custom.css";
import "./assets/style/index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();