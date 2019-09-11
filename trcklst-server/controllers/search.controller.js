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
    .then((data) => {
        return data.body.tracks.items.map((element, i) => {
            return {
                uri: element.uri,
                name: element.name,
                artist: element.album.artists[0].name,
                image: element.album.images[0].url,
            }
        });
    })
    .then(trackList => res.status(httpStatus.OK).send(trackList))
    .catch(e => next(e));
}


module.exports = {
    search,
};