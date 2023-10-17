const { Router } = require('express');
const layananController = require('../controllers/layananController');
const {checkUser} = require('../middleware/authMiddleware');

const router = Router();

router.get('/', checkUser, layananController.index);
router.get('/get', checkUser, layananController.get);
router.get('/get_one/:id', checkUser, layananController.get_one);
router.post('/add', checkUser, layananController.add);
router.post('/edit/:id', checkUser, layananController.edit);

module.exports = router;