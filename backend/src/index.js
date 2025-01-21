const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const bodyParser = require("body-parser");
const postRoutes = require("./routes/postRoutes");
require("./initDB");

dotenv.config();
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
const app = express();
app.use(bodyParser.json());
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});