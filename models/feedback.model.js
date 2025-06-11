const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Feedback = sequelize.define("feedback", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userType: {
    type: DataTypes.ENUM("admin", "client", "developer"),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 5,
    },
  },
});

module.exports = Feedback;
