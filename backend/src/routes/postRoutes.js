const express = require("express");
const { Post, User } = require("../models");
const router = express.Router();

// Получить все посты
router.get("/", async(req, res) => {
    try {
        const posts = await Post.findAll({ include: User });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Создать новый пост
router.post("/", async(req, res) => {
    const { title, content, mediaUrl, userId } = req.body;
    try {
        const post = await Post.create({ title, content, mediaUrl, userId });
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;