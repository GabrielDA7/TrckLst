const { Router } = require('express');
const authController = require('../controllers/auth.controller');

const router = Router();

router.route('/spotify-auth-link')
    /** GET /api/auth/spotify-auth-link - get spotify auth url */
    .get(authController.getSpotifyAuthLink);

router.route('/register-spotify-user')
    /** POST /api/auth/register-spotify-user - register spotify user */
    .post(authController.registerSpotifyUser);

router.route('/register-guest-user')
    /** POST /api/auth/register-guest-user - register guest user */
    .post(authController.registerGuestUser);

module.exports = router;    