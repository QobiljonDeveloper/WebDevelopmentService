const Joi = require("joi");

const clientRegisterSchema = Joi.object({
  full_name: Joi.string().max(50).required(),
  email: Joi.string().email().max(60).required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().max(30).allow(null, ""),
  address: Joi.string().allow(null, ""),
  companyName: Joi.string().allow(null, ""),
  passportSeria: Joi.string().allow(null, ""),
  userType: Joi.string().valid("client").required(),
});

module.exports = clientRegisterSchema;
