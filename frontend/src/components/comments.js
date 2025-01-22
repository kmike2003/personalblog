// src/components/Comments.js
import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { TextField, Button, Typography, Box } from "@mui/material";

const Comments = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`/posts/${postId}/comments`);
                setComments(response.data);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };

        fetchComments();
    }, [postId]);

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleAddComment = async () => {
        try {
            const response = await axios.post(`/posts/${postId}/comments`, { text: newComment });
            setComments([...comments, response.data]);
            setNewComment("");
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    return (
        <Box>
            <Typography variant="h6">Comments</Typography>
            <TextField
                label="Add a comment"
                value={newComment}
                onChange={handleCommentChange}
                fullWidth
                margin="normal"
                multiline
            />
            <Button variant="contained" color="primary" onClick={handleAddComment}>
                Add Comment
            </Button>
            <Box sx={{ marginTop: 2 }}>
                {comments.map((comment) => (
                    <Box key={comment.id} sx={{ marginBottom: 1 }}>
                        <Typography variant="body2">{comment.text}</Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default Comments;
