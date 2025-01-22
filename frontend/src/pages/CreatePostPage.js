import React, { useState } from "react";
import axios from "../api/axios";

const CreatePostPage = () => {
    const [formData, setFormData] = useState({ title: "", content: "" });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("/posts", formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage("Post created successfully!");
        } catch (error) {
            setMessage("Error: " + error.response?.data?.error || "Failed to create post");
        }
    };

    return (
        <div>
            <h1>Create Post</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={formData.title}
                    onChange={handleChange}
                />
                <textarea
                    name="content"
                    placeholder="Content"
                    value={formData.content}
                    onChange={handleChange}
                ></textarea>
                <button type="submit">Create</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default CreatePostPage;
