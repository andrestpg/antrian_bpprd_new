const { Router } = require('express');
const userController = require('../controllers/userController');
const {checkUser, adminOnly} = require('../middleware/authMiddleware');

const router = Router();

router.get('/', checkUser, userController.user_get);
router.get('/get', checkUser, userController.get_all);
router.get('/get/:id', checkUser, userController.get_one);
router.get('/edit_profil/:id', checkUser, userController.edit_profil_page);
router.post('/edit_profil/:id', checkUser, userController.edit_profil_post);
router.post('/add', checkUser, adminOnly, userController.user_add);
router.post('/edit/:id', checkUser, adminOnly, userController.user_edit);
router.get('/delete/:id', checkUser, adminOnly, userController.user_delete);

module.exports = router;