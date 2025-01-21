const { Model, DataTypes } = require("sequelize");

class Post extends Model {
    static initModel(sequelize) {
        Post.init({
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            mediaUrl: {
                type: DataTypes.STRING,
                allowNull: true, // Для изображений/видео
            },
        }, {
            sequelize,
            modelName: "Post",
            timestamps: true, // createdAt и updatedAt
        });
    }
}

module.exports = Post;