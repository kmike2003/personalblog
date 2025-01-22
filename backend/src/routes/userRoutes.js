const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const router = express.Router();

// Регистрация
router.post("/register", async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password) {
        console.error("Ошибка регистрации: отсутствуют обязательные поля.");
        return res.status(400).json({ error: "All fields are required!" });
    }
    if(password != confirmPassword){
        console.error("пароли не совпадают!!")
        return res.status(400).json({ error: "password not equal" });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword });
        res.status(201).json({ message: "User registered!", user });
    } catch (err) {
        console.error("Ошибка регистрации:", {
            message: err.message,
            stack: err.stack, // Полная информация об ошибке
        });
        res.status(400).json({ error: `Registration failed! (${err.message})` });
    }
});
// Вход
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ error: "Invalid username or password!" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid username or password!" });
        }
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.json({
            message: "Login successful!",
            token,
            userId: user.id, // Возвращаем идентификатор пользователя
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "An error occurred during login. Please try again later." });
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