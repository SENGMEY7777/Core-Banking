const biometricService = require('../../services/biometric/biometricService');
const { sendResponse } = require('../../utils/responseHelper');

function run(handler, successMessage, res, req, next) {
  try {
    const data = handler(req);
    return sendResponse(res, 200, true, successMessage, data);
  } catch (error) {
    return sendResponse(res, error.statusCode || 400, false, error.message || 'Request failed', null, error.message);
  }
}

const biometricController = {
  getMenu(req, res) {
    return run(() => biometricService.getMenu(), 'Biometric menu loaded successfully', res, req);
  },

  selectAction(req, res) {
    return run(() => biometricService.selectAction(req.body), 'Action selected successfully', res, req);
  },

  getSession(req, res) {
    return run(() => biometricService.getSession(req.params.sessionId), 'Session loaded successfully', res, req);
  },

  validateSession(req, res) {
    return run(() => biometricService.validateSession(req.params.sessionId), 'Session validated successfully', res, req);
  },

  initiateWebFaceEnrollment(req, res) {
    return run(() => biometricService.initiateWebFaceEnrollment(req.body), 'Web face enrollment initiated', res, req);
  },

  checkAuthenticatedUser(req, res) {
    return run(
      () => biometricService.checkAuthenticatedUser(req.params.enrollmentId, req.body),
      'Authenticated user confirmed',
      res,
      req
    );
  },

  requestWebAuthnServerChallengeNonce(req, res) {
    return run(
      () => biometricService.requestWebAuthnServerChallengeNonce(req.params.enrollmentId),
      'Challenge nonce created',
      res,
      req
    );
  },

  startWebCameraStreamAndCaptureFrames(req, res) {
    return run(
      () => biometricService.startWebCameraStreamAndCaptureFrames(req.params.enrollmentId, req.body),
      'Camera stream started and frames captured',
      res,
      req
    );
  },

  verify3DLiveness(req, res) {
    return run(
      () => biometricService.verify3DLiveness(req.params.enrollmentId, req.body),
      'Liveness verified',
      res,
      req
    );
  },

  compute512DimFacialVector(req, res) {
    return run(
      () => biometricService.compute512DimFacialVector(req.params.enrollmentId, req.body),
      'Facial vector computed',
      res,
      req
    );
  },

  promptBrowserHardwareBiometricVerification(req, res) {
    return run(
      () => biometricService.promptBrowserHardwareBiometricVerification(req.params.enrollmentId),
      'Hardware verification prompt generated',
      res,
      req
    );
  },

  verifyHardwareSignature(req, res) {
    return run(
      () => biometricService.verifyHardwareSignature(req.params.enrollmentId, req.body),
      'Hardware signature verified',
      res,
      req
    );
  },

  completeEnrollment(req, res) {
    return run(
      () => biometricService.completeEnrollment(req.params.enrollmentId),
      'Enrollment completed',
      res,
      req
    );
  },

  enrollBiometricCredential(req, res) {
    return run(
      () => biometricService.enrollBiometricCredential(req.body),
      'Biometric credential enrolled successfully',
      res,
      req
    );
  },

  authenticateAndStepUp(req, res) {
    return run(
      () => biometricService.authenticateAndStepUp(req.body),
      'Authentication and step-up succeeded',
      res,
      req
    );
  },

  revokeBiometricCredential(req, res) {
    return run(
      () => biometricService.revokeBiometricCredential(req.body),
      'Biometric credential revoked successfully',
      res,
      req
    );
  }
};

module.exports = biometricController;
