const Joi = require("joi");

const createUserProfileSchema = Joi.object({
  userId: Joi.number().integer(),
  userType: Joi.string().valid("admin", "client", "developer"),
  avatarUrl: Joi.string().optional(),
  bio: Joi.string().optional(),
  socialLinks: Joi.string().optional(),
});

const updateUserProfileSchema = Joi.object({
  avatarUrl: Joi.string().optional(),
  bio: Joi.string().optional(),
  socialLinks: Joi.string().optional(),
});

module.exports = {
  createUserProfileSchema,
  updateUserProfileSchema,
};
