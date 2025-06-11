const Joi = require("joi");

const updateClientSchema = Joi.object({
  full_name: Joi.string().min(3).max(50).messages({
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
  phone: Joi.string().min(15).max(30),
  address: Joi.string().allow(null, "").optional(),
  companyName: Joi.string().allow(null, "").optional(),
  passportSeria: Joi.string().allow(null, "").optional(),
  isActive: Joi.boolean().optional(),
});

module.exports = {
  updateClientSchema,
};
