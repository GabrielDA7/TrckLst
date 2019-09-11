const uuidv4 = require('uuid/v4');
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const spotifyConstantes = require('../constantes/spotify.constantes');
const config = require('../config');

const { setTokens } = require('../libs/spotifyTokenManger');
const SpotifyWebApi = require('../libs/spotifyWebApi');
const User = require('../models/user.model');
const APIError = require('../libs/apiError');

/**
 * Get spotify auth link
 * @param  req
 * @param  res
 * @returns {string}
 */
function getSpotifyAuthLink(req, res) {
    const state = uuidv4();

    res.cookie(spotifyConstantes.STATE_KEY, state);
    
    const authorizeUrl = SpotifyWebApi.createAuthorizeURL(
        spotifyConstantes.AUTHORIZATION_CODE,
        state
    );

    return res.status(httpStatus.OK).send({ url: authorizeUrl });
}

/**
 * After spotify auth save token in db and return jwt token client
 * @param  req
 * @param  res
 * @param  next
 * @return {user, token}
 */
async function registerSpotifyUser(req, res, next) {
    const code = req.body.code || null;
    const state = req.body.state || null;
    const storedState = req.cookies ? req.cookies[spotifyConstantes.STATE_KEY] : null;

    if ((!state || !storedState) && (state !== storedState)) {
        next(new APIError('State mismatch', httpStatus.BAD_REQUEST));
    } else {
        res.clearCookie(spotifyConstantes.STATE_KEY);
        try {
            const data = await SpotifyWebApi.authorizationCodeGrant(code);
            const expireAt = +new Date() + (data.body.expires_in * 1000);
            const user = new User({
                spotify_access_token: data.body.access_token,
                spotify_refresh_token: data.body.refresh_token,
                spotify_token_expires_at: expireAt,
            });
            await setTokens(user);
            const accountInfo  = await SpotifyWebApi.getMe();

            user.spotify_id = accountInfo.body.id;
            await user.save();

            const token = jwt.sign(user.safeModel(), config.jwtSecret, {
                expiresIn: config.jwtExpiresIn,
            });
            return res.status(httpStatus.CREATED).send({
                token,
                user: user.safeModel(),
            });
        } catch (e) {
            next(e);
        }
    }
}

async function registerGuestUser(req, res, next) {
    const user = new User();
    try {
        await user.save();
        const token = jwt.sign(user.safeModel(), config.jwtSecret, {
            expiresIn: config.jwtExpiresIn,
        });
        return res.status(httpStatus.CREATED).send({
            token,
            user: user.safeModel(),
        });
    } catch(e) {
        next(e);
    }
}


module.exports = {
    getSpotifyAuthLink,
    registerSpotifyUser,
    registerGuestUser
}