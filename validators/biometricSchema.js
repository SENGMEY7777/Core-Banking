const Joi = require('joi');

const uuid = Joi.string().guid({ version: ['uuidv4', 'uuidv5'] });
const userId = Joi.string().trim().min(1).max(128);

const selectActionSchema = Joi.object({
  userId: userId.optional(),
  action: Joi.string()
    .valid('ENROLL_BIOMETRICS', 'AUTHENTICATE_STEP_UP', 'REVOKE_BIOMETRIC')
    .required()
}).unknown(false);

const sessionIdParamsSchema = Joi.object({
  sessionId: uuid.required()
}).unknown(false);

const biometricPayload = {
  sessionId: uuid.required(),
  userId: userId.required()
};

const enrollSchema = Joi.object({
  ...biometricPayload,
  faceTemplate: Joi.string().trim().min(1).required()
}).unknown(false);

const authenticateSchema = enrollSchema;

const revokeSchema = Joi.object({
  sessionId: uuid.required(),
  userId: uuid.required(),
  credentialId: Joi.string().trim().min(1).required()
}).unknown(false);

module.exports = {
  selectActionSchema,
  sessionIdParamsSchema,
  enrollSchema,
  authenticateSchema,
  revokeSchema
};
