const {
    sortTracksByScore,
    getIndexTrack,
    shouldReorderPlaylist,
    reorderSpotifyPlaylist
} = require('./playlistUtils');
const APIError = require('./apiError');
const Room = require('../models/room.model');

const upVote = async (socket, track) => {
    const room = await Room.get(socket.room_id);
    const user = socket.decoded_token;

    if (userHasVoted(user._id, room, track))
        return Promise.reject(new APIError('already voted'));

    const updatedRoom = await Room.upVote(room._id, track, user._id);

    const previousTracksList = sortTracksByScore(room.tracks, room.playedSongPosition);
    const nextTracksList = sortTracksByScore(updatedRoom.tracks, room.playedSongPosition);

    const previousTrackIndex = getIndexTrack(previousTracksList, track.uri);
    const nextTrackIndex = getIndexTrack(nextTracksList, track.uri);

    if (!shouldReorderPlaylist(previousTrackIndex, nextTrackIndex))
        return Promise.resolve(nextTracksList);

    await reorderSpotifyPlaylist(socket.room_owner, room, previousTrackIndex, nextTrackIndex, nextTracksList);
    updatedRoom.tracks = nextTracksList;
    await updatedRoom.save();

    return Promise.resolve(nextTracksList);
};

const userHasVoted = (userId, room, track) => {
    const foundedTrack = room.tracks.find(function (element) {
        return element.uri === track.uri;
    });
    if (!foundedTrack)
        return false;

    const foundedVoter = foundedTrack.voters.find(function (element) {
        return element.user_id === userId;
    });
    if (!foundedVoter)
        return false;

    return true;
}

module.exports = {
    upVote
}