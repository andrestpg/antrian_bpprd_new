const { Router } = require('express');
const loketController = require('../controllers/loketController');
const {checkUser, adminOnly} = require('../middleware/authMiddleware');

const router = Router();

router.get('/', checkUser, adminOnly, loketController.index);
router.get('/get', checkUser, adminOnly, loketController.get);
router.get('/get_not_registered', checkUser, adminOnly, loketController.get_not_registered);
router.get('/get_one/:id', checkUser, adminOnly, loketController.get_one);
router.post('/add', checkUser, adminOnly, loketController.add);
router.post('/edit/:id', checkUser, adminOnly, loketController.edit);
router.get('/delete/:id', checkUser, adminOnly, loketController.delete);

module.exports = router;