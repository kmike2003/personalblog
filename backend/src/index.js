const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const bodyParser = require("body-parser");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
require("./initDB");

const corsOptions = {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"], 
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true
};

dotenv.config();
const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/comments", commentRoutes);
app.options('*', cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend is running!");
});
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// Предвариельный (preflight) запрос OPTIONS
app.options("*", (req, res) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.sendStatus(204);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});