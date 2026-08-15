const router = require('express').Router();
const authenticateToken = require('../../middlewares/authMiddleware');
const biometricController = require('../../controllers/biometric/biometricController');
const validate = require('../../middlewares/validate');
const {
  selectActionSchema,
  sessionIdParamsSchema,
  enrollSchema,
  authenticateSchema,
  revokeSchema
} = require('../../validators/biometricSchema');

router.get('/menu', authenticateToken, biometricController.getMenu);
router.post('/select-action', authenticateToken, validate(selectActionSchema), biometricController.selectAction);
router.get('/session/:sessionId', authenticateToken, validate(sessionIdParamsSchema, 'params'), biometricController.getSession);
router.get('/session/:sessionId/validate', authenticateToken, validate(sessionIdParamsSchema, 'params'), biometricController.validateSession);
router.post('/enroll', authenticateToken, validate(enrollSchema), biometricController.enroll);
router.post('/authenticate', authenticateToken, validate(authenticateSchema), biometricController.authenticate);
router.post('/revoke', authenticateToken, validate(revokeSchema), biometricController.revoke);

module.exports = router;
