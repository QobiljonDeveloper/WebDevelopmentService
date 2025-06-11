const jwt = require("jsonwebtoken");
const {
  AdminJwtService,
  ClientJwtService,
  DeveloperJwtService,
} = require("../../services/jwt.service");

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

const roleGuard = (allowedRoles = []) => {
  return (req, res, next) => {
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

      const { userType } = tempDecoded;
      const jwtService = getJwtService(userType);

      if (!jwtService) {
        return res
          .status(400)
          .json({ message: "Noto‘g‘ri foydalanuvchi turi" });
      }

      const decoded = jwtService.verifyAccessToken(token);

      if (userType === "admin" && decoded.isSuperAdmin) {
        req.user = { ...decoded, userType };
        return next();
      }

      const isAllowed = allowedRoles.includes(userType);
      if (!isAllowed) {
        return res
          .status(403)
          .json({ message: "Bu marshrutga kirish taqiqlangan" });
      }

      req.user = { ...decoded, userType };
      next();
    } catch (error) {
      console.error("roleGuard error:", error.message);
      res.status(401).json({ message: "Token noto‘g‘ri yoki muddati o‘tgan" });
    }
  };
};

module.exports = roleGuard;
