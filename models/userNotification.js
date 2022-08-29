const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../dbConnection").sequelize;

const User = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },

    content: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
    },

    senderID: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      references: {
        model: "User",
        key: "id",
      },
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = User;
