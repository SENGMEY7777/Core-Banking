const router = require('express').Router();
const adminController = require('../../controllers/admin/authController');
const authenticateToken = require('../../middlewares/authMiddleware');


router.post('/login', adminController.login);
router.get('/me', authenticateToken, adminController.me);

module.exports = router;
