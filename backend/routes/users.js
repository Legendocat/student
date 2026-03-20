const express = require('express');
const auth = require('../middleware/auth');
const controller = require('../controllers/userController');

const router = express.Router();

router.get('/me', auth, controller.getMe);

module.exports = router;
