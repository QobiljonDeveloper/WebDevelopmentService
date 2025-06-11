const Joi = require("joi");

const createContractSchema = Joi.object({
  start_date: Joi.date().required(),
  end_date: Joi.date().required(),
  total_amount: Joi.number().precision(2).required(),
  notes: Joi.string().allow(""),
  clientId: Joi.number().integer().required(),
  websiteId: Joi.number().integer().required(),
  statusId: Joi.number().integer().required(),
});

const updateContractSchema = Joi.object({
  start_date: Joi.date(),
  end_date: Joi.date(),
  total_amount: Joi.number().precision(2),
  notes: Joi.string().allow("").optional(),
  clientId: Joi.number().integer(),
  websiteId: Joi.number().integer(),
  statusId: Joi.number().integer(),
}).min(1);

module.exports = {
  createContractSchema,
  updateContractSchema,
};
