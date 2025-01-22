// src/components/PostForm.js
import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { TextField, Button, Box } from "@mui/material";

const PostForm = ({ post, onClose, onPostCreated }) => {
    const [formData, setFormData] = useState({ title: "", content: "" });

    useEffect(() => {
        if (post) {
            setFormData({ title: post.title, content: post.content });
        }
    }, [post]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (post) {
                // Update post
                response = await axios.put(`/posts/${post.id}`, formData);
            } else {
                // Create new post
                response = await axios.post("/posts", formData);
            }
            onPostCreated(response.data);
            onClose();
        } catch (error) {
            console.error("Error creating/updating post:", error);
        }
    };

    return (
        <Box sx={{ marginBottom: 4 }}>
            <TextField
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                margin="normal"
            />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button variant="outlined" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={handleSubmit}>
                    {post ? "Update" : "Create"} Post
                </Button>
            </Box>
        </Box>
    );
};

export default PostForm;
