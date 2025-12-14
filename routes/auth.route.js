import express from 'express';
import * as controller from '../controllers/auth.controller.js';
import { authGuard } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.get('/profile', authGuard, controller.getProfile);
router.get('/dashboard', authGuard, controller.dashboard);
router.get('/users', authGuard, controller.getAllUsers);
router.get('/test', controller.test);

export default router;
