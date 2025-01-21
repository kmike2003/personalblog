const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const router = express.Router();

// Регистрация
router.post("/register", async(req, res) => {
    const { username, password, email } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("User model:", User); // Проверяем, определён ли User
        const user = await User.create({ username, password: hashedPassword, email });
        res.status(201).json({ message: "User registered!", user });
    } catch (err) {
        console.error("Registration failed:", err);
        res.status(400).json({ error: `Registration failed! (${err.message})` });
    }
});

// Вход
router.post("/login", async(req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid credentials!" });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.json({ message: "Login successful!", token });
    } catch (err) {
        res.status(400).json({ error: "Login failed!" });
    }
});

router.get("/", async(req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", async(req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = await User.create({ username, email, password });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;