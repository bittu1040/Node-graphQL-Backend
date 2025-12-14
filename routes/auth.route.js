const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const { authGuard } = require('../middleware/auth.middleware');

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.get('/dashboard', authGuard, controller.dashboard);

module.exports = router;
