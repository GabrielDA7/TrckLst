const { setTokens } = require('./spotifyTokenManger');
const SpotifyWebApi = require('./spotifyWebApi');
const Room = require('../models/room.model');
const { trackAlreadyExist } = require('./playlistUtils');
const APIError = require('./apiError');

const addTrack = async (socket, track) => {
    let room = await Room.get(socket.room_id);
    if (trackAlreadyExist(room.tracks, track))
        return Promise.reject(new APIError('song already exist'));

    await setTokens(socket.room_owner);
    await SpotifyWebApi.addTracksToPlaylist(room.spotify_playlist_id, [track.uri]);

    room.tracks.push(track);
    room = await room.save();

    return Promise.resolve(room.tracks);
}

module.exports = {
    addTrack
}