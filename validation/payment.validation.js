const Joi = require("joi");

const createPaymentSchema = Joi.object({
  payment_date: Joi.date().required().messages({
    "any.required": `"payment_date" majburiy`,
    "date.base": `"payment_date" sana bo'lishi kerak`,
  }),
  amount: Joi.number().positive().required().messages({
    "any.required": `"amount" majburiy`,
    "number.base": `"amount" son bo'lishi kerak`,
    "number.positive": `"amount" musbat son bo'lishi kerak`,
  }),
  method: Joi.string().valid("cash", "card", "transfer").required().messages({
    "any.required": `"method" majburiy`,
    "any.only": `"method" faqat "cash", "card", yoki "transfer" bo'lishi kerak`,
  }),
  statusId: Joi.number().required().messages({
    "any.required": `"statusId" majburiy`,
    "number.base": `"statusId" son bo'lishi kerak`,
  }),
  contractId: Joi.number().required().messages({
    "any.required": `"contractId" majburiy`,
    "number.base": `"contractId" son bo'lishi kerak`,
  }),
});

const updatePaymentSchema = Joi.object({
  payment_date: Joi.date().messages({
    "date.base": `"payment_date" sana bo'lishi kerak`,
  }),
  amount: Joi.number().positive().messages({
    "number.base": `"amount" son bo'lishi kerak`,
    "number.positive": `"amount" musbat son bo'lishi kerak`,
  }),
  method: Joi.string().valid("cash", "card", "transfer").messages({
    "any.only": `"method" faqat "cash", "card", yoki "transfer" bo'lishi kerak`,
  }),
  statusId: Joi.number().messages({
    "number.base": `"statusId" son bo'lishi kerak`,
  }),
});

module.exports = {
  createPaymentSchema,
  updatePaymentSchema,
};
