const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
const User = require("./User");
const Post = require("./Post");
const Comment = require("./Comment");
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
Comment.initModel(sequelize);

// Установка связей между моделями
User.hasMany(Post, { foreignKey: "userId" });
Post.belongsTo(User, { foreignKey: "userId" });

Post.hasMany(Comment, { foreignKey: "postId" });
Comment.belongsTo(Post, { foreignKey: "postId" });

// Убираем дублирование ассоциаций с User
// Используем уникальные алиасы
User.hasMany(Comment, { foreignKey: "userId", as: "AuthoredComments" }); // Комментарии пользователя
Comment.belongsTo(User, { foreignKey: "userId", as: "Author" }); // Автор комментария


module.exports = {
    sequelize,
    User,
    Post,
    Comment
}