const Joi = require("joi");

const createWebsiteSchema = Joi.object({
  title: Joi.string().max(20).required().messages({
    "string.base": "Title matn bo'lishi kerak",
    "string.max": "Title eng ko'pi bilan 20 ta belgidan iborat bo'lishi kerak",
    "any.required": "Title majburiy",
  }),
  price: Joi.number().precision(2).messages({
    "number.base": "Narx raqam bo'lishi kerak",
  }),
  duration: Joi.number().integer().required().messages({
    "number.base": "Davomiylik raqam bo'lishi kerak",
    "any.required": "Davomiylik majburiy",
  }),
  statusId: Joi.number().integer().required().messages({
    "any.required": "Status ID majburiy",
    "number.base": "Status ID raqam bo'lishi kerak",
  }),
  typeId: Joi.number().integer().required().messages({
    "any.required": "WebsiteType ID majburiy",
    "number.base": "WebsiteType ID raqam bo'lishi kerak",
  }),
});

const updateWebsiteSchema = Joi.object({
  title: Joi.string().max(20).messages({
    "string.base": "Title matn bo'lishi kerak",
    "string.max": "Title eng ko'pi bilan 20 ta belgidan iborat bo'lishi kerak",
  }),
  price: Joi.number().precision(2).messages({
    "number.base": "Narx raqam bo'lishi kerak",
  }),
  duration: Joi.number().integer().messages({
    "number.base": "Davomiylik raqam bo'lishi kerak",
  }),
  statusId: Joi.number().integer().messages({
    "number.base": "Status ID raqam bo'lishi kerak",
  }),
  typeId: Joi.number().integer().messages({
    "number.base": "WebsiteType ID raqam bo'lishi kerak",
  }),
});

module.exports = {
  createWebsiteSchema,
  updateWebsiteSchema,
};
