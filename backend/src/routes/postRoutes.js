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

router.get("/posts", async (req, res) => {
    const { userId } = req.query; // Получаем userId из параметра запроса
    if (!userId) {
        return res.status(400).json({ error: "userId is required" }); // Если userId не передан, возвращаем ошибку
    }
    try {
        const posts = await Post.findAll({
            where: { userId }, // Фильтруем посты по userId
            include: { model: User, attributes: ['username', 'id'] }, // Включаем данные пользователя (например, имя)
        });
        if (posts.length === 0) {
            return res.status(404).json({ message: "No posts found for this user" });
        }
        res.json(posts); // Возвращаем посты
    } catch (error) {
        console.error(error);
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

// Получить пост по ID
router.get("/:postId", async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await Post.findOne({
            where: { id: postId },
            include: [User, { model: Comment, include: [User] }],
        });
        if (!post) return res.status(404).json({ error: "Post not found" });
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Обновить пост
router.put("/:postId", async (req, res) => {
    const { postId } = req.params;
    const { title, content, mediaUrl } = req.body;
    try {
        const post = await Post.findByPk(postId);
        if (!post) return res.status(404).json({ error: "Post not found" });

        await post.update({ title, content, mediaUrl });
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Удалить пост
router.delete("/:postId", async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await Post.findByPk(postId);
        if (!post) return res.status(404).json({ error: "Post not found" });

        await post.destroy();
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получить все посты конкретного пользователя
router.get("/user/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const posts = await Post.findAll({
            where: { userId }, // Фильтруем посты по userId
            include: User, // Присоединяем данные о пользователе
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/user/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const posts = await Post.findAll({ where: { userId }, include: User });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;