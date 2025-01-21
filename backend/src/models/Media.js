const { Model, DataTypes } = require("sequelize");

class Media extends Model {
    static initModel(sequelize) {
        Media.init({
            url: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            size: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        }, {
            sequelize,
            modelName: "Media",
            timestamps: true,
        });
    }
}

module.exports = Media;