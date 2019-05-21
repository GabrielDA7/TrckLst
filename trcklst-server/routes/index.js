const { Router } = require('express');
const expressJwt = require('express-jwt');
const { jwtSecret } = require('../config');
const { authHandler } = require('../middlewares');
const { OK } = require('http-status');

const authRoutes = require('./auth.routes');
const deviceRoutes = require('./device.routes');
const roomRoutes = require('./room.routes');
const searchRoutes = require('./search.routes');

const router = Router();

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.status(OK).send('OK'));

// mount auth routes at /auth
router.use('/auth', authRoutes);

// Validating all the APIs with jwt token.
router.use(expressJwt({ secret: jwtSecret }));

// If jwt is valid, storing user data in local session.
router.use(authHandler);

// mount device routes at /devices
router.use('/devices', deviceRoutes);

// mount rooms routes at /rooms
router.use('/rooms', roomRoutes);

// mount search routes at /search
router.use('/search', searchRoutes);


module.exports = router;
