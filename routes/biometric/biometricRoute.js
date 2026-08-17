const router = require('express').Router();
const authenticateToken = require('../../middlewares/authMiddleware');
const biometricController = require('../../controllers/biometric/biometricController');

router.use(authenticateToken);

router.get('/menu', biometricController.getMenu);
router.post('/select-action', biometricController.selectAction);
router.get('/session/:sessionId', biometricController.getSession);
router.get('/session/:sessionId/validate', biometricController.validateSession);

router.post('/enrollment/initiate', biometricController.initiateWebFaceEnrollment);
router.post('/enrollment/:enrollmentId/auth-check', biometricController.checkAuthenticatedUser);
router.post('/enrollment/:enrollmentId/challenge', biometricController.requestWebAuthnServerChallengeNonce);
router.post('/enrollment/:enrollmentId/camera/start', biometricController.startWebCameraStreamAndCaptureFrames);
router.post('/enrollment/:enrollmentId/liveness', biometricController.verify3DLiveness);
router.post('/enrollment/:enrollmentId/vector', biometricController.compute512DimFacialVector);
router.get('/enrollment/:enrollmentId/hardware-prompt', biometricController.promptBrowserHardwareBiometricVerification);
router.post('/enrollment/:enrollmentId/hardware-verify', biometricController.verifyHardwareSignature);
router.post('/enrollment/:enrollmentId/complete', biometricController.completeEnrollment);

router.post('/enroll', biometricController.enrollBiometricCredential);
router.post('/authenticate', biometricController.authenticateAndStepUp);
router.post('/revoke', biometricController.revokeBiometricCredential);

module.exports = router;
