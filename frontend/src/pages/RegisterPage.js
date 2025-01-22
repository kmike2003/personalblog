import React, { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Box, Container, TextField, Button, Typography } from "@mui/material";

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [logs, setLogs] = useState([]);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const addLog = (message) => {
        setLogs((prevLogs) => [...prevLogs, message]);
    };    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setMessage("Passwords do not match.");
            addLog("Error: Passwords do not match.");
            return;
        }
    
        addLog("Отправляем данные: " + JSON.stringify(formData));
    
        try {
            console.log(axios)
            console.log(axios.getUri())
            const response = await axios.post("/users/register", formData);
            addLog("Ответ от сервера: " + JSON.stringify(response.data));
            setMessage("Registration successful!");
            navigate("/login");
        } catch (error) {
            console.error("Error details:", error); // Логи в консоль
            const errorMessage = error.response?.data?.error || error.message || "Unknown error";
            addLog("Ошибка при регистрации: " + errorMessage);
            setMessage("Error: " + errorMessage);
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
                    Register
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
                        label="Email"
                        name="email"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={formData.email}
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
                    <TextField
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        fullWidth
                        margin="normal"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ marginTop: 2 }}
                    >
                        Register
                    </Button>
                </form>
                {message && (
                    <Typography variant="body2" color="error" sx={{ marginTop: 2 }}>
                        {message}
                    </Typography>
                )}
                <Box
                sx={{
                    marginTop: 2,
                    padding: 1,
                    border: "1px solid gray",
                    borderRadius: 1,
                    width: "100%",
                    maxHeight: "200px",
                    overflowY: "auto",
                }}
            >
                <Typography variant="body2">Logs:</Typography>
                {logs.map((log, index) => (
                    <Typography key={index} variant="body2" color="textSecondary">
                        {log}
                    </Typography>
                ))}
            </Box>
            </Box>
        </Container>
    );
};

export default RegisterPage;
