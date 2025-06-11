const jwt = require("jsonwebtoken");
const { sendErrorResponse } = require("../../helpers/send_error_response");
const {
  AdminJwtService,
  ClientJwtService,
  DeveloperJwtService,
} = require("../../services/jwt.service");

const Admin = require("../../models/admin.model");
const Client = require("../../models/client.model");
const Developer = require("../../models/developer.model");

const Models = {
  feedback: require("../../models/feedback.model"),
  userProfile: require("../../models/userProfile.model"),
  client: require("../../models/client.model"),
  developer: require("../../models/developer.model"),
  notification: require("../../models/notification.model").Notification,
  payment: require("../../models/payment.model"),
};

const getUserModel = (userType) => {
  switch (userType) {
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

const getJwtService = (userType) => {
  switch (userType) {
    case "admin":
      return AdminJwtService;
    case "client":
      return ClientJwtService;
    case "developer":
      return DeveloperJwtService;
    default:
      return null;
  }
};

const selfOrAdminGuard = (modelName, options = {}) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: "Token topilmadi" });
      }

      const token = authHeader.split(" ")[1];
      const tempDecoded = jwt.decode(token);

      if (!tempDecoded || !tempDecoded.userType) {
        return res.status(400).json({ message: "Token noto‘g‘ri" });
      }

      const userType = tempDecoded.userType;
      const jwtService = getJwtService(userType);
      if (!jwtService) {
        return res
          .status(400)
          .json({ message: "Noto‘g‘ri foydalanuvchi turi" });
      }

      const decoded = jwtService.verifyAccessToken(token);
      const { id: userId } = decoded;

      const UserModel = getUserModel(userType);
      const user = await UserModel.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
      }

      req.user = user;
      req.userType = userType;

      const resourceId = req.params.id;
      const ResourceModel = Models[modelName];
      if (!ResourceModel) {
        return res
          .status(500)
          .json({ message: `Model ${modelName} topilmadi` });
      }

      const resource = await ResourceModel.findByPk(resourceId);
      if (!resource) {
        return res.status(404).json({ message: `${modelName} topilmadi` });
      }

      // 🔑 Har doim admin kira oladi
      if (userType === "admin") return next();

      const checkUserId = String(resource.userId) === String(userId);

      // 🔁 Agar `options.checkUserType === true` bo‘lsa, `userType` ham tekshiriladi
      const checkUserType =
        !options.checkUserType || resource.userType === userType;

      if (checkUserId && checkUserType) {
        return next();
      }

      return res.status(403).json({
        message: "Siz bu resursga kira olmaysiz",
      });
    } catch (error) {
      console.error("selfOrAdminGuard error:", error.message);
      sendErrorResponse(error, res);
    }
  };
};

module.exports = selfOrAdminGuard;
