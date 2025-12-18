import express from 'express';
import * as controller from '../controllers/events.controller.js';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// basic rate limiter for clients
const publicLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per windowMs
	standardHeaders: true,
	legacyHeaders: false,
	handler: (req, res) => {
		return res.status(429).json({ success: '0 records added', failed: 'Rate limit exceeded' });
	}
});

// middleware to require secret header for trusted clients
const requireSecret = (req, res, next) => {
	const secret = process.env.EVENTS_SECRET || 'default_event_secret';
	const providedSecret = req.header('x-events-secret') || req.query.secret;
	if (!providedSecret || providedSecret !== secret) {
		return res.status(401).json({ success: '0 records added', failed: 'Unauthorized' });
	}
	next();
};

// Ensure preflight requests are handled by CORS
router.options('/', cors());

// Apply CORS, require secret header, then always apply rate limiting
router.post('/', cors(), requireSecret, publicLimiter, controller.createEvent);

router.get('/', controller.listEvents);

export default router;
