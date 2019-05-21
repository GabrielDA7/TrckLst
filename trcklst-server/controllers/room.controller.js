const httpStatus = require('http-status');
const SpotifyWebApi = require('../libs/spotifyWebApi');
const { setTokens } =  require('../libs/spotifyTokenManger');
const Room = require('../models/room.model');
const User = require('../models/user.model');

/**
 * Create a room & spotify playlist
 * @param  req
 * @param  res
 * @param  next
 * @return {Room}
 */
function create(req, res, next) {
  const room = new Room(req.body);
  room.owner_id = res.locals.session._id;

  User.get(room.owner_id)
    .then((user) => setTokens(user))
    .then(user => SpotifyWebApi.createPlaylist(user.spotify_id, room.name, { public: true }))
    .then((data) => {
      room.spotify_playlist_uri = data.body.uri;
      return room.save();
    })
    .then(savedRoom => res.status(httpStatus.CREATED).json(savedRoom))
    .catch(e => next(e));
}

/**
 * Play room playlist
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function play(req, res, next) {
  const room = req.room;
  User.get(room.owner_id)
  .then((user) => setTokens(user))
  .then(() => SpotifyWebApi.play({
    device_id: room.device_id,
    context_uri: room.spotify_playlist_uri,
  }))
  .then(data => res.status(httpStatus.CREATED).json(data.body))
  .catch(e => next(e));
}

/**
 * Load room and append to req.
 */
function load(req, res, next, id) {
  Room.get(id)
    .then((room) => {
        req.room = room;
        return next();
    })
    .catch(e => next(e));
}

/**
 * Get room
 * @returns {Room}
 */
function get(req, res) {
  return res.json(req.room);
}


module.exports = {
  create,
  get,
  load,
  play,
};
