const Joi = require("joi");

const createFeedbackSchema = Joi.object({
  content: Joi.string().required().messages({
    "string.base": "content matn bo‘lishi kerak",
    "any.required": "content majburiy",
  }),
  rating: Joi.number().min(1).max(5).optional().messages({
    "number.base": "rating son bo‘lishi kerak",
    "number.min": "rating kamida 1 bo‘lishi kerak",
    "number.max": "rating eng ko‘pi 5 bo‘lishi kerak",
  }),
});

const updateFeedbackSchema = Joi.object({
  content: Joi.string().optional(),
  rating: Joi.number().min(1).max(5).optional(),
});

module.exports = {
  createFeedbackSchema,
  updateFeedbackSchema,
};
