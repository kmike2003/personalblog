const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
const User = require("./User");
const Post = require("./Post");

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
        logging: false,
    }
);

// Инициализация моделей
User.initModel(sequelize);
Post.initModel(sequelize);

// Установка связей между моделями
User.hasMany(Post, { foreignKey: "userId" });
Post.belongsTo(User, { foreignKey: "userId" });

module.exports = {
    sequelize,
    User,
    Post,
};