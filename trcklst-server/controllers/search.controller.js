const SpotifyWebApi = require('../libs/spotifyWebApi');
const httpStatus = require('http-status');
const User = require('../models/user.model');
const { setTokens } = require('../libs/spotifyTokenManger');

/**
 * Search song
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function search(req, res, next) {
    const term = req.params.term;
    const types = req.params.types.split(',');
    const room = req.room;

    User.get(room.owner_id)
    .then(owner => setTokens(owner))
    .then(() => SpotifyWebApi.search(term, types, {limit: 10}))
    .then(data => res.status(httpStatus.OK).send(data.body))
    .catch(e => next(e));
}


module.exports = {
    search,
};