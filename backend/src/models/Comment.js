const { Model, DataTypes } = require("sequelize");

class Comment extends Model {
    static initModel(sequelize) {
        Comment.init({
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            postId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        }, {
            sequelize,
            modelName: "Comment",
            timestamps: true,
        });
    }
}

module.exports = Comment;
