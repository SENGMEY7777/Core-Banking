const biometricService = require('../../services/biometric/biometricService');
const { sendResponse } = require('../../utils/responseHelper');

const getMenu = (req, res) => {
  try {
    return sendResponse(res, 200, true, 'Biometric navigation menu loaded successfully', biometricService.getMenu());
  } catch (error) {
    return sendResponse(res, error.statusCode || 500, false, 'Failed to load biometric menu', null, error.message);
  }
};

const selectAction = (req, res) => {
  try {
    const { userId, action } = req.body;
    const result = biometricService.selectAction({ userId, action });
    return sendResponse(res, 201, true, 'Action selected successfully', result);
  } catch (error) {
    return sendResponse(res, error.statusCode || 500, false, 'Failed to select action', null, error.message);
  }
};

const getSession = (req, res) => {
  try {
    const result = biometricService.getSession(req.params.sessionId);
    return sendResponse(res, 200, true, 'Session loaded successfully', result);
  } catch (error) {
    return sendResponse(res, error.statusCode || 500, false, 'Failed to load session', null, error.message);
  }
};

const validateSession = (req, res) => {
  try {
    const result = biometricService.validateSession(req.params.sessionId);
    return sendResponse(res, 200, true, result.message, result);
  } catch (error) {
    return sendResponse(res, error.statusCode || 500, false, 'Failed to validate session', null, error.message);
  }
};

const enroll = (req, res) => {
  try {
    const result = biometricService.enrollBiometricCredential(req.body);
    return sendResponse(res, 200, true, 'Enroll process completed successfully', result);
  } catch (error) {
    return sendResponse(res, error.statusCode || 500, false, 'Failed to enroll biometric credential', null, error.message);
  }
};

const authenticate = (req, res) => {
  try {
    const result = biometricService.authenticateAndStepUp(req.body);
    return sendResponse(res, 200, true, 'Authenticate process completed successfully', result);
  } catch (error) {
    return sendResponse(res, error.statusCode || 500, false, 'Failed to authenticate and step-up', null, error.message);
  }
};

const revoke = (req, res) => {
  try {
    const result = biometricService.revokeBiometricCredential(req.body);
    return sendResponse(res, 200, true, 'Revoke process completed successfully', result);
  } catch (error) {
    return sendResponse(res, error.statusCode || 500, false, 'Failed to revoke biometric credential', null, error.message);
  }
};

module.exports = {
  getMenu,
  selectAction,
  getSession,
  validateSession,
  enroll,
  authenticate,
  revoke
};
