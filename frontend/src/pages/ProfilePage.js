import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Box, Container, Button, Typography, Grid, Card, CardContent, CardActions } from "@mui/material";
import PostForm from "../components/PostForm";

const ProfilePage = () => {
    const [posts, setPosts] = useState([]);
    const [message, setMessage] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem("userId");

        if (!userId) {
            navigate("/login");
            return;
        }

        const fetchPosts = async () => {
            try {
                const response = await axios.get(`/posts?userId=${userId}`);
                setPosts(response.data);
            } catch (err) {
                console.error("Failed to fetch posts:", err);
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
            setPosts((prevPosts) => prevPosts.filter(post => post.id !== postId));
            setMessage("Post deleted successfully.");
            setTimeout(() => setMessage(""), 3000); // Убираем сообщение через 3 секунды
        } catch (error) {
            setMessage("Error deleting post.");
            console.error(error);
        }
    };

    const handlePostCreatedOrUpdated = (newPost) => {
        setIsEditing(false);
    
        // Повторно вызываем функцию fetchPosts для обновления данных
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

    // Функция для форматирования даты
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return date.toLocaleString("en-US", options);
    };

    return (
        <Container component="main" maxWidth="md">
            <Box sx={{ marginBottom: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Profile
                </Typography>
                {/* Форма для создания поста сверху */}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        setIsEditing(true);
                        setCurrentPost(null); // Очистка текущего поста для создания нового
                    }}
                    sx={{ marginBottom: 2 }}
                >
                    Create Post
                </Button>

                {isEditing && (
                    <PostForm
                        post={currentPost}
                        onClose={() => setIsEditing(false)}
                        onPostCreated={handlePostCreatedOrUpdated}
                    />
                )}
                
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
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            wordWrap: "break-word", // Перенос слов
                                            overflowWrap: "break-word", // Перенос длинных слов
                                            whiteSpace: "pre-wrap", // Сохраняет пробелы и переносы строк
                                        }}
                                    >
                                        {post.content}
                                    </Typography>
                                    {/* Отображение времени создания/обновления */}
                                    <Typography
                                        variant="caption"
                                        color="textSecondary"
                                        sx={{ display: "block", marginTop: 1 }}
                                    >
                                        {post.updatedAt
                                            ? `Last updated: ${formatDate(post.updatedAt)}`
                                            : `Created: ${formatDate(post.createdAt)}`}
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
            </Box>
        </Container>
    );
};

export default ProfilePage;
