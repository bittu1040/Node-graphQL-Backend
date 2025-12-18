import express from 'express';
import * as controller from '../controllers/events.controller.js';
import cors from 'cors';

const router = express.Router();

router.post('/', cors(), controller.createEvent);
router.get('/', controller.listEvents);

export default router;
