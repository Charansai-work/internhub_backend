const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');

// REGISTER
router.post('/register', authController.register);

// LOGIN
router.post('/login', authController.login);

// GET ME
router.get('/me', authController.getMe);

// UPDATE PROFILE
router.put('/profile', authController.updateProfile);

module.exports = router;