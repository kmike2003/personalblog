import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const PostsPage = () => {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/users")
        const fetchPosts = async () => {
            try {
                const response = await axios.get("/posts");
                setPosts(response.data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
        fetchPosts();
    }, []);

    const handleCreatePost = () => {
        navigate("/create-post");
    };

    return (
        <div>
            <h1>Posts</h1>
            <button onClick={handleCreatePost}>Create New Post</button>
            <ul>
                {posts.map((post) => (
                    <li key={post.id}>
                        <h3>{post.title}</h3>
                        <p>{post.content}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PostsPage;
