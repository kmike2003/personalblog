const express = require("express");
const { Comment } = require("../models");
const router = express.Router();

// Получить комментарии для поста
router.get("/:postId", async (req, res) => {
    const { postId } = req.params;
    try {
        // Запрашиваем комментарии с включением данных о пользователях
        const comments = await Comment.findAll({
            where: { postId },
            include: [
                {
                    model: User,
                    as: "User", // Убедитесь, что alias соответствует вашей ассоциации
                    attributes: ["id", "username"], // Выбираем только нужные поля пользователя
                },
            ],
        });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/", async (req, res) => {
    const { postId } = req.query;

    try {
        if (postId) {
            const comments = await Comment.findAll({ where: { postId }, include: User });
            return res.json(comments);
        }

        const comments = await Comment.findAll({ include: User });
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

router.post("/posts/:postId/comments", async (req, res) => {
    const { postId } = req.params;
    const { content, userId } = req.body;

    try {
        const comment = await Comment.create({ content, userId, postId });
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/", async (req, res) => {
    const { postId, page = 1, limit = 10 } = req.query;

    try {
        const offset = (page - 1) * limit;
        const comments = await Comment.findAndCountAll({
            where: { postId },
            include: User,
            limit: parseInt(limit),
            offset,
        });

        res.json({
            comments: comments.rows,
            totalComments: comments.count,
            totalPages: Math.ceil(comments.count / limit),
        });
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


router.get("/user/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const posts = await Post.findAll({
            where: { userId },
            include: {
                model: Comment,
                include: [User], // Включаем информацию о пользователе, оставившем комментарий
            },
        });

        const response = posts.map((post) => ({
            postId: post.id,
            postTitle: post.title,
            postContent: post.content,
            comments: post.Comments,
        }));

        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
