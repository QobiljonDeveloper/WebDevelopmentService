const Joi = require("joi");

const updateDeveloperSchema = Joi.object({
  full_name: Joi.string().min(3).max(50).optional(),
  email: Joi.string().email(),
  password: Joi.string().min(6),
  company: Joi.string().allow(null, "").optional(),
  phone: Joi.string().min(15).max(30),
  portfolioUrl: Joi.string().uri().allow(null, "").optional(),
  isActive: Joi.boolean().optional(),
});

module.exports = {
  updateDeveloperSchema,
};
