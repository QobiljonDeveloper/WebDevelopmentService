const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Status = require("./status.model");
const WebsiteType = require("./websiteType.model");

const Website = sequelize.define(
  "website",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(8, 2),
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    createdAt: "createdAt",
    updatedAt: false,
  }
);

Website.belongsTo(Status, { foreignKey: "statusId" });
Status.hasMany(Website, { foreignKey: "statusId" });

Website.belongsTo(WebsiteType, { foreignKey: "typeId" });
WebsiteType.hasMany(Website, { foreignKey: "typeId" });

module.exports = Website;
