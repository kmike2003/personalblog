const sequelize = require("./models/index");
const User = require("./models/User");
const Post = require("./models/Post");
const Media = require("./models/Media");

const initDB = async() => {
    try {
        await sequelize.authenticate();
        console.log("Database connected!");

        // Синхронизация моделей с базой данных
        await sequelize.sync({ alter: true });
        console.log("Tables created!");
    } catch (error) {
        console.error("Database connection failed:", error);
    }
};

initDB();