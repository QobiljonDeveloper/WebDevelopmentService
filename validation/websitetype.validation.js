const Joi = require("joi");

const createwebsiteTypeSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  description: Joi.string().allow(null, "").optional(),
});

const updatewebsiteTypeSchema = Joi.object({
  name: Joi.string().min(3).max(20).optional(),
  description: Joi.string().allow(null, "").optional(),
});

module.exports = { createwebsiteTypeSchema, updatewebsiteTypeSchema };
