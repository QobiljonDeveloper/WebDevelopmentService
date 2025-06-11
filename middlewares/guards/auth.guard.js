const config = require("config"); 
const jwt = require("jsonwebtoken");
const Admin = require("../../models/admin.model");
const Client = require("../../models/client.model");
const Developer = require("../../models/developer.model");

const getUserModel = (type) => {
  switch (type) {
    case "admin":
      return Admin;
    case "client":
      return Client;
    case "developer":
      return Developer;
    default:
      return null;
  }
};

const getAccessKey = (userType) => {
  switch (userType) {
    case "admin":
      return config.get("access_key_admin");
    case "client":
      return config.get("access_key_client");
    case "developer":
      return config.get("access_key_dev");
    default:
      return null;
  }
};

const authGuard = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token topilmadi" });
    }

    const decodedWithoutVerify = jwt.decode(token);     
    const accessKey = getAccessKey(decodedWithoutVerify?.userType);

    if (!accessKey) {
      return res
        .status(401)
        .json({ message: "Noto'g'ri foydalanuvchi turi (userType)" });
    }

    const decoded = jwt.verify(token, accessKey);
    const { id, userType } = decoded;

    const Model = getUserModel(userType);
    if (!Model) {
      return res.status(500).json({
        message: "Ichki xatolik: Foydalanuvchi modeli aniqlanmadi",
        error: `Noto'g'ri userType: ${userType}`,
      });
    }

    const user = await Model.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    }

    req.user = user;
    req.userType = userType;
    next();
  } catch (error) {
    console.error("Auth Guard xatolik:", error);
    return res.status(401).json({
      message: "Token yaroqsiz",
      error: error.message,
    });
  }
};

module.exports = authGuard;
