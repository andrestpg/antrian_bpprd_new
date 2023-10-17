const { Router } = require('express');
const publikController = require('../controllers/publikController');

const router = Router();

router.get('/', publikController.index);
router.get('/tiket', publikController.tiket);
router.get('/daftar_antrian/:layananId', publikController.daftar_antrian);
router.get('/next_antrian/:layananId/:loketId', publikController.next_antrian);

module.exports = router;