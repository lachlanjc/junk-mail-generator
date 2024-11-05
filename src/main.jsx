import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Theme
      accentColor="brown"
      panelBackground="solid"
      variant="classic"
      style={{ backgroundColor: "var(--brown-5)" }}
    >
      <App />
    </Theme>
  </React.StrictMode>,
);
