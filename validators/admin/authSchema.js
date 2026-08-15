const Joi = require("joi");

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/;

const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .pattern(emailRegex)
    .max(255)
    .required()
    .messages({
      "any.required": "Email is required",
      "string.empty": "Email is required",
      "string.pattern.base": "Please provide a valid email address",
      "string.max": "Email must not exceed 255 characters",
    }),

  password: Joi.string()
    .pattern(passwordRegex)
    .max(64)
    .required()
    .messages({
      "any.required": "Password is required",
      "string.empty": "Password is required",
      "string.pattern.base":
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character",
      "string.max": "Password must not exceed 64 characters",
    }),
});

module.exports = loginSchema;