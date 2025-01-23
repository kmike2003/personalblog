import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    TextField,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";

const UserProfilePage = () => {
    const { userId } = useParams(); // ID пользователя из URL
    const [posts, setPosts] = useState([]); // Посты пользователя
    const [comments, setComments] = useState({}); // Комментарии к каждому посту
    const [newComments, setNewComments] = useState({}); // Новые комментарии (по постам)
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`/posts?userId=${userId}`);
                setPosts(response.data);
            } catch (err) {
                console.error("Failed to fetch posts:", err);
            }
        };

        fetchPosts();
    }, [userId]);

    // Загрузка комментариев для конкретного поста
    const fetchComments = async (postId) => {
        try {
            const response = await axios.get(`/comments?postId=${postId}`);
            setComments((prevComments) => ({
                ...prevComments,
                [postId]: response.data,
            }));
        } catch (err) {
            console.error("Failed to fetch comments:", err);
        }
    };

    // Обработка добавления нового комментария
    const handleAddComment = async (postId) => {
        const content = newComments[postId]; // Получаем текст комментария из состояния
        const userId = localStorage.getItem("userId"); // Получаем userId из localStorage

        if (!content || !userId) return; // Проверяем, что комментарий и userId существуют

        try {
            const response = await axios.post("/comments", { content, userId, postId });
            setComments((prevComments) => ({
                ...prevComments,
                [postId]: [...(prevComments[postId] || []), response.data],
            }));
            setNewComments((prevNewComments) => ({
                ...prevNewComments,
                [postId]: "",
            }));
        } catch (err) {
            console.error("Failed to add comment:", err);
        }
    };

    // Обработка ввода в поле комментария
    const handleCommentChange = (postId, value) => {
        setNewComments((prevNewComments) => ({
            ...prevNewComments,
            [postId]: value,
        }));
    };

    return (
        <Container component="main" maxWidth="md">
            <Typography variant="h4" gutterBottom>
                User's Posts
            </Typography>

            <Grid container spacing={3}>
                {posts.map((post) => (
                    <Grid item xs={12} key={post.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{post.title}</Typography>
                                <Typography variant="body2">{post.content}</Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    size="small"
                                    color="primary"
                                    onClick={() => fetchComments(post.id)}
                                >
                                    Show Comments
                                </Button>
                            </CardActions>

                            {/* Список комментариев */}
                            {comments[post.id] && (
                                <List>
                                    {comments[post.id].map((comment) => (
                                        <ListItem key={comment.id}>
                                            <ListItemText primary={comment.content} />
                                        </ListItem>
                                    ))}
                                </List>
                            )}

                            {/* Форма добавления комментария */}
                            <Box sx={{ padding: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Add a comment"
                                    value={newComments[post.id] || ""}
                                    onChange={(e) =>
                                        handleCommentChange(post.id, e.target.value)
                                    }
                                    variant="outlined"
                                    multiline
                                    rows={2}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleAddComment(post.id)}
                                    sx={{ marginTop: 1 }}
                                >
                                    Submit
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default UserProfilePage;
