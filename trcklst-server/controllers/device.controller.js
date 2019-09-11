const SpotifyWebApi = require('../libs/spotifyWebApi');
const { setTokens } = require('../libs/spotifyTokenManger');
const User = require('../models/user.model');
const httpStatus = require('http-status');
const handleAuth = require('../libs/authHandler');

/**
 * Get the spotify user devices
 * @param req 
 * @param res 
 * @param next 
 */
async function get(req, res, next) {
  try {
    const user = await User.get(res.locals.session._id);
    handleAuth(user);
    await setTokens(user);
    const data = await SpotifyWebApi.getMyDevices();
    return res.status(httpStatus.OK).send(data.body);
  } catch (e) {
    next(e);
  }
}

module.exports = {
  get,
};