const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const WebsiteType = sequelize.define(
  "websiteType",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    createdAt: "createdAt",
    updatedAt: false,
  }
);

module.exports = WebsiteType;
