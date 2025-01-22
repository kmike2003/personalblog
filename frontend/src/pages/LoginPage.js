import React, { useState } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { Box, Container, TextField, Button, Typography } from "@mui/material";

const LoginPage = () => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/users/login", formData);
            const { token, userId } = response.data; // Получаем токен и userId из ответа
            localStorage.setItem("token", token); // Сохраняем токен
            localStorage.setItem("userId", userId); // Сохраняем userId
            setMessage("Login successful!");
            navigate("/profile"); // Перенаправляем на страницу профиля
        } catch (error) {
            setMessage("Error: " + (error.response?.data?.error || error.message));
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: 2,
                    boxShadow: 3,
                    borderRadius: 2,
                    backgroundColor: "white",
                }}
            >
                <Typography variant="h5" gutterBottom>
                    Login
                </Typography>
                <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                    <TextField
                        label="Username"
                        name="username"
                        fullWidth
                        margin="normal"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        name="password"
                        fullWidth
                        margin="normal"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ marginTop: 2 }}
                    >
                        Login
                    </Button>
                </form>
                {message && (
                    <Typography variant="body2" color="error" sx={{ marginTop: 2 }}>
                        {message}
                    </Typography>
                )}
                <Typography variant="body2" sx={{ marginTop: 2 }}>
                    Don't have an account?{" "}
                    <Link to="/register" style={{ textDecoration: "none", color: "#1976d2" }}>
                        Sign up here
                    </Link>
                </Typography>
            </Box>
        </Container>
    );
};

export default LoginPage;
