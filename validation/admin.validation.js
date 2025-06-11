const Joi = require("joi");

const createAdminSchema = Joi.object({
  full_name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().optional(),
  isSuperAdmin: Joi.boolean().optional(),
});

const updateAdminSchema = Joi.object({
  full_name: Joi.string().min(3).max(50).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
  isActive: Joi.boolean().optional(),
});

module.exports = {
  createAdminSchema,
  updateAdminSchema,
};
