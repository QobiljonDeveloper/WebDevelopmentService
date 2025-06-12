const logger = require("../services/logger.service");
const bcrypt = require("bcrypt");
const config = require("config");
const crypto = require("crypto");
const { sendErrorResponse } = require("../helpers/send_error_response");

const clientRegisterSchema = require("../validation/client.register.validation");
const developerRegisterSchema = require("../validation/developer.vregister.validation");
const loginSchema = require("../validation/login.validation");

const {
  DeveloperJwtService,
  ClientJwtService,
  AdminJwtService,
} = require("../services/jwt.service");

const Admin = require("../models/admin.model");
const Client = require("../models/client.model");
const Developer = require("../models/developer.model");
const mailService = require("../services/mail.service");

// Foydalanuvchi modelini aniqlash
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

// JWT service aniqlash
const getJwtService = (type) => {
  switch (type) {
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

// LOGIN
const login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error)
      return sendErrorResponse({ message: error.details[0].message }, res);

    const { email, password, userType } = req.body;
    const Model = getUserModel(userType);
    const jwtService = getJwtService(userType);

    if (!Model || !jwtService)
      return sendErrorResponse(
        { message: "Noto'g'ri foydalanuvchi turi" },
        res
      );

    const user = await Model.findOne({ where: { email } });
    if (!user)
      return sendErrorResponse({ message: "Email yoki parol noto'g'ri" }, res);

    if (!user.isActive)
      return res
        .status(403)
        .json({ message: "Akkountingiz faollashtirilmagan." });

    const verified = await bcrypt.compare(password, user.password);
    if (!verified)
      return sendErrorResponse({ message: "Email yoki parol noto'g'ri" }, res);

    const payload = {
      id: user.id,
      email: user.email,
      userType,
      ...(userType === "admin" && { isSuperAdmin: user.isSuperAdmin }),
    };

    const tokens = jwtService.generateTokens(payload);
    const hashedToken = await bcrypt.hash(tokens.accessToken, 7);

    user.hashed_token = hashedToken;
    await user.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("cookie_refresh_time"),
      httpOnly: true,
    });

    res.status(200).send({
      message: "Tizimga kirildi",
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    sendErrorResponse(error, res);
  }
};

// REGISTER
const register = async (req, res) => {
  try {
    const { userType } = req.body;

    if (userType === "admin") {
      return sendErrorResponse(
        { message: "Admin ro'yxatdan o'ta olmaydi" },
        res
      );
    }

    let schema;
    switch (userType) {
      case "client":
        schema = clientRegisterSchema;
        break;
      case "developer":
        schema = developerRegisterSchema;
        break;
      default:
        return sendErrorResponse(
          { message: "Noto'g'ri foydalanuvchi turi" },
          res
        );
    }

    const { error } = schema.validate(req.body);
    if (error)
      return sendErrorResponse({ message: error.details[0].message }, res);

    const {
      full_name,
      email,
      password,
      company,
      phone,
      portfolioUrl,
      address,
      companyName,
      passportSeria,
    } = req.body;

    const Model = getUserModel(userType);
    const exists = await Model.findOne({ where: { email } });
    if (exists)
      return sendErrorResponse({ message: "Email allaqachon mavjud" }, res);

    const hashedPassword = await bcrypt.hash(password, 10);
    const activationToken = crypto.randomBytes(32).toString("hex");

    let userData = {
      full_name,
      email,
      password: hashedPassword,
      phone,
      isActive: false,
      activationToken,
    };

    if (userType === "developer") {
      userData.company = company;
      userData.portfolioUrl = portfolioUrl;
    }

    if (userType === "client") {
      userData.address = address;
      userData.companyName = companyName;
      userData.passportSeria = passportSeria;
    }

    const newUser = await Model.create(userData);
    const activationLink = `${config.get(
      "api_url"
    )}/api/activate/auth/${activationToken}`;
    await mailService.sendMail(email, activationLink);

    res.status(201).send({
      message:
        "Ro'yxatdan o'tdingiz. Faollashtirish uchun emailingizni tekshiring.",
    });
  } catch (error) {
    logger.error(`Register error: ${error.message}`);
    sendErrorResponse({ message: "Server xatosi" }, res);
  }
};

// LOGOUT
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      logger.warn("Logout failed: Refresh token mavjud emas");
      return sendErrorResponse(
        { message: "Refresh token mavjud emas", statusCode: 400 },
        res
      );
    }

    let decoded, jwtService;
    for (const type of ["admin", "client", "developer"]) {
      try {
        const service = getJwtService(type);
        decoded = service.verifyRefreshToken(refreshToken);
        jwtService = service;
        break;
      } catch (_) {}
    }

    if (!decoded || !jwtService) {
      logger.warn("Logout failed: Token noto‘g‘ri yoki eskirgan");
      return sendErrorResponse(
        { message: "Token noto‘g‘ri yoki eskirgan", statusCode: 401 },
        res
      );
    }

    const Model = getUserModel(decoded.userType);
    if (!Model) {
      logger.warn(`Logout failed: invalid userType - ${decoded.userType}`);
      return sendErrorResponse(
        { message: "Noto'g'ri foydalanuvchi turi", statusCode: 400 },
        res
      );
    }

    const user = await Model.findByPk(decoded.id);
    if (!user) {
      logger.warn(`Logout failed: user not found - id: ${decoded.id}`);
      return sendErrorResponse(
        { message: "Foydalanuvchi topilmadi", statusCode: 404 },
        res
      );
    }

    user.hashed_token = null;
    await user.save();

    res.clearCookie("refreshToken");
    logger.info(
      `User logged out successfully: id=${user.id}, type=${decoded.userType}`
    );

    res.status(200).send({ message: "Tizimdan chiqildi" });
  } catch (error) {
    logger.error(`Logout error: ${error.message}`, { stack: error.stack });
    sendErrorResponse(
      { message: "Serverda xatolik yuz berdi", statusCode: 500 },
      res
    );
  }
};

// REFRESH TOKEN
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      logger.warn("Refresh token mavjud emas");
      return sendErrorResponse(
        { message: "Refresh token mavjud emas", statusCode: 400 },
        res
      );
    }

    let decoded, jwtService;
    for (const type of ["admin", "client", "developer"]) {
      try {
        const service = getJwtService(type);
        decoded = service.verifyRefreshToken(refreshToken);
        jwtService = service;
        decoded.userType = type;
        break;
      } catch (_) {}
    }

    if (!decoded || !jwtService) {
      logger.warn("Refresh token noto‘g‘ri yoki eskirgan");
      return sendErrorResponse(
        { message: "Token noto‘g‘ri yoki eskirgan", statusCode: 401 },
        res
      );
    }

    const Model = getUserModel(decoded.userType);
    if (!Model) {
      logger.warn(`Refresh token: invalid userType - ${decoded.userType}`);
      return sendErrorResponse(
        { message: "Noto'g'ri foydalanuvchi turi", statusCode: 400 },
        res
      );
    }

    const user = await Model.findByPk(decoded.id);
    if (!user) {
      logger.warn(`Refresh token: user not found - id: ${decoded.id}`);
      return sendErrorResponse(
        { message: "Foydalanuvchi topilmadi", statusCode: 404 },
        res
      );
    }

    if (user.refresh_token && user.refresh_token !== refreshToken) {
      logger.warn("Refresh token mos emas");
      return sendErrorResponse(
        { message: "Refresh token mos emas", statusCode: 401 },
        res
      );
    }

    const payload = {
      id: user.id,
      email: user.email,
      userType: decoded.userType,
    };

    const tokens = jwtService.generateTokens(payload);
    user.refresh_token = tokens.refreshToken;
    await user.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: config.get("cookie_refresh_time"),
      httpOnly: true,
    });

    logger.info(
      `Refresh token muvaffaqiyatli yangilandi: id=${user.id}, type=${decoded.userType}`
    );

    res.status(200).send({
      message: "Token muvaffaqiyatli yangilandi",
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    logger.error(`Refresh token error: ${error.message}`, {
      stack: error.stack,
    });
    sendErrorResponse(
      { message: "Serverda xatolik yuz berdi", statusCode: 500 },
      res
    );
  }
};

// AKKAUNTNI AKTIVATSIYA QILISH
const activate = async (req, res) => {
  try {
    const { token } = req.params;

    const userTypes = ["developer", "client", "admin"];
    let user = null;

    for (const type of userTypes) {
      const Model = getUserModel(type);
      user = await Model.findOne({ where: { activationToken: token } });

      if (user) {
        if (user.isActive) {
          return res
            .status(400)
            .send({ message: "Akkount allaqachon faollashtirilgan" });
        }

        user.isActive = true;
        user.activationToken = null;
        await user.save();

        return res
          .status(200)
          .send({ message: "Akkount muvaffaqiyatli faollashtirildi" });
      }
    }

    return res
      .status(400)
      .send({ message: "Faollashtirish tokeni noto‘g‘ri yoki muddati o‘tgan" });
  } catch (error) {
    logger.error(`Activate error: ${error.message}`, { stack: error.stack });
    res.status(500).send({ message: "Serverda xatolik yuz berdi" });
  }
};

module.exports = {
  login,
  register,
  logout,
  refreshToken,
  activate,
};
