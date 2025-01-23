import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Container,
    Button,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
} from "@mui/material";
import PostForm from "../components/PostForm";

const ProfilePage = () => {
    const [posts, setPosts] = useState([]);
    const [message, setMessage] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);
    const [username, setUsername] = useState(""); // Для хранения имени профиля
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        const storedUser = localStorage.getItem("user"); // Проверяем, существует ли ключ "user"
        if (!userId || !storedUser) {
            navigate("/login"); // Если данные отсутствуют, перенаправляем на страницу логина
            return;
        }

        try {
            setUsername(storedUser.toString()); // Устанавливаем имя пользователя
        } catch (error) {
            console.error("Failed to parse user data:", error);
            navigate("/login"); // В случае ошибки возвращаем пользователя на логин
        }

        const fetchPosts = async () => {
            try {
                const response = await axios.get(`/posts?userId=${userId}`);
                setPosts(response.data); // Устанавливаем посты в состояние
            } catch (err) {
                console.error("Failed to fetch posts:", err);
                setMessage("Error fetching posts.");
            }
        };

        fetchPosts();
    }, [navigate]);

    const handleEditPost = (post) => {
        setCurrentPost(post);
        setIsEditing(true);
    };

    const handleDeletePost = async (postId) => {
        try {
            await axios.delete(`/posts/${postId}`);
            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
            setMessage("Post deleted successfully.");
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            setMessage("Error deleting post.");
            console.error(error);
        }
    };

    const handlePostCreatedOrUpdated = (newPost) => {
        setIsEditing(false);

        if (newPost.id) {
            setPosts((prevPosts) =>
                prevPosts.map((post) => (post.id === newPost.id ? newPost : post))
            );
        } else {
            setPosts((prevPosts) => [newPost, ...prevPosts]);
        }

        const fetchPosts = async () => {
            const userId = localStorage.getItem("userId");

            if (!userId) {
                navigate("/login");
                return;
            }

            try {
                const response = await axios.get(`/posts?userId=${userId}`);
                setPosts(response.data); // Обновляем список постов
            } catch (err) {
                console.error("Failed to fetch posts:", err);
            }
        };

        fetchPosts();
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <Container component="main" maxWidth="md">
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 4,
                }}
            >
                <Typography variant="h4" gutterBottom>
                    {username ? `Profile: ${username}` : "Profile"}
                </Typography>
                <Box>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/")} // Переход на главную
                        sx={{ marginRight: 2 }}
                    >
                        Home
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Box>
            </Box>
            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    setIsEditing(true);
                    setCurrentPost(null);
                }}
                sx={{ marginBottom: 2 }}
            >
                Create Post
            </Button>
            {message && (
                <Typography variant="body1" color="error" sx={{ marginBottom: 2 }}>
                    {message}
                </Typography>
            )}
            <Grid container spacing={3}>
                {posts.map((post) => (
                    <Grid item xs={12} md={6} key={post.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{post.title}</Typography>
                                <Typography variant="body2">{post.content}</Typography>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    display="block"
                                    sx={{ marginTop: 1 }}
                                >
                                    Created at: {new Date(post.createdAt).toLocaleString()}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    size="small"
                                    color="primary"
                                    onClick={() => handleEditPost(post)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    size="small"
                                    color="secondary"
                                    onClick={() => handleDeletePost(post.id)}
                                >
                                    Delete
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {isEditing && (
                <PostForm
                    post={currentPost}
                    onClose={() => setIsEditing(false)}
                    onPostCreated={handlePostCreatedOrUpdated}
                />
            )}
        </Container>
    );
};

export default ProfilePage;
