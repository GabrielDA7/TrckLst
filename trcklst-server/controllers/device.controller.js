const SpotifyWebApi = require('../libs/spotifyWebApi');
const { setTokens } = require('../libs/spotifyTokenManger');
const User = require('../models/user.model');
const httpStatus = require('http-status');

/**
 * Get the spotify user devices
 * @param req 
 * @param res 
 * @param next 
 */
function get(req, res, next) {
    User.get(res.locals.session._id)
    .then((user) => setTokens(user))
    .then(() => SpotifyWebApi.getMyDevices())
    .then(data => res.status(httpStatus.OK).json(data.body))
    .catch(e =>  next(e));
}


module.exports = {
  get,
};