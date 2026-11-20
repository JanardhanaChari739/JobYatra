const express = require('express');
const router = express.Router();
const { register, login, socialAuth, getMe, updateProfile } = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/social', socialAuth);
router.get('/me', authenticate, getMe);
router.patch('/profile', authenticate, updateProfile);

module.exports = router;
