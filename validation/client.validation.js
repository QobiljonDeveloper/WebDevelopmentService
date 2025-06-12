const Joi = require("joi");

const updateClientSchema = Joi.object({
  full_name: Joi.string().min(3).max(50),
  email: Joi.string().email(),
  password: Joi.string().min(6),
  phone: Joi.string().min(15).max(30),
  address: Joi.string().allow(null, "").optional(),
  companyName: Joi.string().allow(null, "").optional(),
  passportSeria: Joi.string().allow(null, "").optional(),
  isActive: Joi.boolean().optional(),
});

module.exports = {
  updateClientSchema,
};
