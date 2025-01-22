// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import App from "./App";
import theme from "./theme";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Сброс стандартных стилей браузера */}
        <App /> {/* Здесь уже обернут Router в App */}
    </ThemeProvider>
);
