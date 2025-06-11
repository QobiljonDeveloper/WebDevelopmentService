const Joi = require("joi");

const createNotificationSchema = Joi.object({
  userId: Joi.number().required().messages({
    "number.base": "userId son bo‘lishi kerak",
    "any.required": "userId majburiy",
  }),
  message: Joi.string().required().messages({
    "string.base": "message matn bo‘lishi kerak",
    "any.required": "message majburiy",
  }),
});

const updateNotificationSchema = Joi.object({
  isRead: Joi.boolean().required().messages({
    "boolean.base": "isRead faqat true yoki false bo‘lishi mumkin",
    "any.required": "isRead majburiy",
  }),
});

module.exports = {
  createNotificationSchema,
  updateNotificationSchema,
};
