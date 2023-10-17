const { Router } = require('express');
const authController = require('../controllers/authController');
const { checkUserLogin } = require('../middleware/authMiddleware');

const router = Router();

router.get('/', checkUserLogin, authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout);

module.exports = router;