const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Developer = require("./developer.model");
const Contract = require("./contract.model");

const ContractDeveloper = sequelize.define(
  "contractDeveloper",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    contractId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    developerId: {
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

ContractDeveloper.belongsTo(Contract, { foreignKey: "contractId" });
ContractDeveloper.belongsTo(Developer, { foreignKey: "developerId" });

Contract.hasMany(ContractDeveloper, { foreignKey: "contractId" });
Developer.hasMany(ContractDeveloper, { foreignKey: "developerId" });

module.exports = ContractDeveloper;
