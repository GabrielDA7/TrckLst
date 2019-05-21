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
function registerSpotifyUser(req, res, next) {
    const code = req.body.code || null;
    const state = req.body.state || null;
    const storedState = req.cookies ? req.cookies[spotifyConstantes.STATE_KEY] : null;

    if ((!state || !storedState) && (state !== storedState)) {
        next(new APIError('State mismatch', httpStatus.BAD_REQUEST));
    } else {
        res.clearCookie(spotifyConstantes.STATE_KEY);
        SpotifyWebApi.authorizationCodeGrant(code)
            .then((data) => {
                const expireAt = +new Date() + (data.body.expires_in * 1000);
                console.log(expireAt, typeof expireAt);
                const user = new User({
                    spotify_access_token: data.body.access_token,
                    spotify_refresh_token: data.body.refresh_token,
                    spotify_token_expires_at: expireAt,
                });
                return user;
            })
            .then((user) => {
                return setTokens(user)
            })
            .then((user) => {
                return SpotifyWebApi.getMe()
                    .then(data => Promise.resolve([data, user]));
            })
            .then(([data, user]) => {
                user.spotify_id = data.body.id;
                return user.save();
            })
            .then((savedUser) => {
                const token = jwt.sign(savedUser.safeModel(), config.jwtSecret, {
                    expiresIn: config.jwtExpiresIn,
                });
                return res.status(httpStatus.CREATED).send({
                    token,
                    user: savedUser.safeModel(),
                });
            })
            .catch(err => next(err));
    }
}

function registerGuestUser(req, res, next) {
  const user = new User();
  user.save()
    .then(() => {
        const token = jwt.sign(user.safeModel(), config.jwtSecret, {
            expiresIn: config.jwtExpiresIn,
        });
        return res.status(httpStatus.CREATED).json({
            token,
            user: user.safeModel(),
        });
    })
    .catch(e => next(e));
}


module.exports = {
    getSpotifyAuthLink,
    registerSpotifyUser,
    registerGuestUser
}