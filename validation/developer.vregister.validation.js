const Joi = require("joi");

const developerRegisterSchema = Joi.object({
  full_name: Joi.string().max(50).required(),
  email: Joi.string().email().max(60).required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().max(30).allow(null, ""),
  company: Joi.string().allow(null, ""),
  portfolioUrl: Joi.string().uri().allow(null, ""),
  userType: Joi.string().valid("developer").required(),
});

module.exports = developerRegisterSchema;
