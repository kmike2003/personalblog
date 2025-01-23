import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import {
    Container,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    Box,
} from "@mui/material";

const HomePage = () => {
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState(null); // Состояние для имени пользователя
    const navigate = useNavigate();

    useEffect(() => {
        // Проверяем, авторизован ли пользователь
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUsername(storedUser); // Устанавливаем имя пользователя, если оно есть
        }

        // Функция для получения списка пользователей
        const fetchUsers = async () => {
            try {
                const response = await axios.get("/users/users"); // Запрос списка пользователей с сервера
                setUsers(response.data); // Сохраняем пользователей в состояние
            } catch (err) {
                console.error("Failed to fetch users:", err);
            }
        };

        fetchUsers();
    }, []);

    const handleLoginRedirect = () => {
        navigate("/login");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("user");
        setUsername(null); // Сбрасываем имя пользователя
        navigate("/"); // Перенаправляем на главную страницу
    };

    return (
        <Container component="main" maxWidth="sm">
            <Box sx={{ textAlign: "center", marginTop: 4, marginBottom: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Welcome to the Blog
                </Typography>
                {username ? (
                    // Если пользователь авторизован, показываем его имя и кнопку выхода
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Logged in as: {username}
                        </Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleLogout}
                            sx={{ marginBottom: 4 }}
                        >
                            Logout
                        </Button>
                    </Box>
                ) : (
                    // Если пользователь не авторизован, показываем кнопку "Login"
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleLoginRedirect}
                        sx={{ marginBottom: 4 }}
                    >
                        Login
                    </Button>
                )}
            </Box>

            <Typography variant="h5" gutterBottom>
                Browse Users
            </Typography>
            <List>
                {users.length > 0 ? (
                    users.map((user) => (
                        <ListItem key={user.id} button>
                            <ListItemText
                                primary={
                                    <Link
                                        to={`/user/${user.id}`}
                                        style={{ textDecoration: "none", color: "#1976d2" }}
                                    >
                                        {user.username}
                                    </Link>
                                }
                            />
                        </ListItem>
                    ))
                ) : (
                    <Typography variant="body1" color="text.secondary">
                        No users found.
                    </Typography>
                )}
            </List>
        </Container>
    );
};

export default HomePage;
