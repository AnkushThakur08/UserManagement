const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../dbConnection").sequelize;

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
    },

    email: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },

    password: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },

    phoneNumber: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },

    googleId: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },

    facebookID: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },

    authenticationMethod: {
      type: DataTypes.STRING,
    },

    gender: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },

    age: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },

    address: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },

    resetToken: {
      type: DataTypes.STRING,
    },

    inivitationStatus: {
      type: DataTypes.STRING,
    },
    senderEmail: {
      type: DataTypes.STRING,
    },

    resetToken: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = User;
