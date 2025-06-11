const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Contract = require("./contract.model");
const Status = require("./status.model");

const Payment = sequelize.define(
  "payment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    method: {
      type: DataTypes.ENUM("cash", "card", "transfer"),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    createdAt: "createdAt",
    updatedAt: false,
  }
);

Payment.belongsTo(Contract, { foreignKey: "contractId" });
Contract.hasMany(Payment, { foreignKey: "contractId" });

Payment.belongsTo(Status, { foreignKey: "statusId" });
Status.hasMany(Payment, { foreignKey: "statusId" });

module.exports = Payment;
