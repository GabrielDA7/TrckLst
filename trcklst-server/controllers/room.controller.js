const httpStatus = require('http-status');
const SpotifyWebApi = require('../libs/spotifyWebApi');
const { setTokens } = require('../libs/spotifyTokenManger');
const Room = require('../models/room.model');
const User = require('../models/user.model');
const authHandler = require('../libs/authHandler');
const APIError = require('../libs/apiError');

/**
 * Create a room & spotify playlist
 * @param  req
 * @param  res
 * @param  next
 * @return {Room}
 */
async function create(req, res, next) {
  const room = new Room(req.body);
  room.owner_id = res.locals.session._id;
  
  try {
    const owner = await User.get(room.owner_id);
    authHandler(owner);
    await setTokens(owner);
    const data = await SpotifyWebApi.createPlaylist(owner.spotify_id, room.name, { public: true });
    room.spotify_playlist_uri = data.body.uri;
    room.spotify_playlist_id = data.body.id;
    await room.save();
    return res.status(httpStatus.CREATED).send(room);
  } catch (e) {
    console.log(e);
    next(e);
  }
}

/**
 * Play room playlist
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function play(req, res, next) {
  const room = req.room;
  try {
    const owner = await User.get(room.owner_id);
    await setTokens(owner);
    const data = await SpotifyWebApi.play({
      device_id: room.device_id,
      context_uri: room.spotify_playlist_uri,
      offset: {
        position: room.played_song_position == -1 ? 0 : room.played_song_position
      }
    });
    return res.status(httpStatus.NO_CONTENT).send(data.body);
  } catch (e) {
    next(e);
  }
}

/**
 * Play room playlist
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function pause(req, res, next) {
  const room = req.room;
  try {
    const owner = await User.get(room.owner_id);
    await setTokens(owner);
    const data = await SpotifyWebApi.pause({
      device_id: room.device_id,
      context_uri: room.spotify_playlist_uri,
    });
    return res.status(httpStatus.NO_CONTENT).send(data.body);
  } catch (e) {
    next(e);
  }
}

/**
 * Load room and append to req.
 */
async function load(req, res, next, id) {
  try {
    const room = await Room.get(id);
    req.room = room;
    next();
  } catch(e) {
    next(e);
  }
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
  pause
};
