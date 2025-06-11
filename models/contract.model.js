const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Client = require("./client.model");
const Status = require("./status.model");
const Website = require("./websites.model");
const Contract = sequelize.define(
  "contract",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
    },
  },
  {
    freezeTableName: true,
    createdAt: "createdAt",
    updatedAt: false,
  }
);

Contract.belongsTo(Client, { foreignKey: "clientId" });
Client.hasMany(Contract, { foreignKey: "clientId" });



Contract.belongsTo(Status, { foreignKey: "statusId" });
Status.hasMany(Contract, { foreignKey: "statusId" });


Contract.belongsTo(Website, { foreignKey: "websiteId" });
Website.hasOne(Contract, { foreignKey: "websiteId" });


module.exports = Contract;
