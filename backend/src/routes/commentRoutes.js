const express = require("express");
const { Comment } = require("../models");
const router = express.Router();

// Получить комментарии для поста
router.get("/:postId", async (req, res) => {
    const { postId } = req.params;
    try {
        const comments = await Comment.findAll({ where: { postId }, include: ["User"] });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Создать комментарий
router.post("/", async (req, res) => {
    const { content, userId, postId } = req.body;
    try {
        const comment = await Comment.create({ content, userId, postId });
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Удалить комментарий
router.delete("/:commentId", async (req, res) => {
    const { commentId } = req.params;
    try {
        const comment = await Comment.findByPk(commentId);
        if (!comment) return res.status(404).json({ error: "Comment not found" });

        await comment.destroy();
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
