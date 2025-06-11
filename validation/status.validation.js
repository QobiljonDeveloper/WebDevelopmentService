const Joi = require("joi");

const createStatusSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  description: Joi.string().allow(null, "").optional(),
});

const updateStatusSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional(),
  description: Joi.string().allow(null, "").optional(),
});

module.exports = {
  createStatusSchema,
  updateStatusSchema,
};
