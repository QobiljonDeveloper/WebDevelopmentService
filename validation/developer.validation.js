const Joi = require("joi");

const updateDeveloperSchema = Joi.object({
  full_name: Joi.string().min(3).max(50).optional().messages({
    "string.base": `"full_name" matn bo'lishi kerak`,
    "string.min": `"full_name" kamida 3 ta belgi bo'lishi kerak`,
    "string.max": `"full_name" 50 ta belgidan oshmasligi kerak`,
  }),
  email: Joi.string().email().messages({
    "string.email": `"email" noto‘g‘ri formatda kiritilgan`,
  }),
  password: Joi.string().min(6).messages({
    "string.min": `"password" kamida 6 ta belgi bo'lishi kerak`,
  }),
  company: Joi.string().allow(null, "").optional(),
  phone: Joi.string().min(15).max(30),
  portfolioUrl: Joi.string().uri().allow(null, "").optional().messages({
    "string.uri": `"portfolioUrl" to‘g‘ri URL formatda bo‘lishi kerak`,
  }),
  isActive: Joi.boolean().optional(),
});

module.exports = {
  updateDeveloperSchema,
};
