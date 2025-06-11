const Joi = require("joi");

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  userType: Joi.string().valid("admin", "client", "developer").required(),
});

module.exports = loginSchema;
