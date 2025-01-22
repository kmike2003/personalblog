// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#1976d2", // Основной цвет
        },
        secondary: {
            main: "#ff4081", // Дополнительный цвет
        },
    },
    typography: {
        fontFamily: "'Roboto', 'Arial', sans-serif",
    },
});

export default theme;
