const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const UserProfile = sequelize.define("userProfile", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userType: {
    type: DataTypes.ENUM("admin", "client", "developer"),
    allowNull: false,
  },
  avatarUrl: {
    type: DataTypes.STRING,
  },
  bio: {
    type: DataTypes.TEXT,
  },
  socialLinks: {
    type: DataTypes.TEXT,
  },
});

module.exports = UserProfile;
