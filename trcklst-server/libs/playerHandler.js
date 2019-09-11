const { POLL_RATE } = require('../constantes/polling.constantes');
const SpotifyWebApi = require('./spotifyWebApi');
const { setTokens } = require('./spotifyTokenManger');
const httpStatus = require('http-status');
const Room = require('../models/room.model');
const { sortTracksByScore } = require('../libs/playlistUtils');

const handlePlayer = async (socket, io) => {
    console.log('handle');
    await setTokens(socket.room_owner);
    const data = await SpotifyWebApi.getMyCurrentPlaybackState();
    if (data.statusCode == httpStatus.NO_CONTENT)
        io.in(socket.room_id).emit('player-paused');

    if (data.statusCode == httpStatus.OK) {
        socket.currentTrackSoonFinished = false;

        if(data.body.progress_ms && data.body.item && data.body.item.duration_ms) {
            socket.currentTrackSoonFinished = (data.body.item.duration_ms - data.body.progress_ms) <= POLL_RATE * 2 ? true : false ;
        }

        if(socket.currentTrackSoonFinished != socket.previousCurrentTrackSoonFinished && !socket.currentTrackSoonFinished) {
            io.to(socket.room_id).emit('actions-unlocked');
        }

        if(socket.currentTrackSoonFinished != socket.previousCurrentTrackSoonFinished && socket.currentTrackSoonFinished) {
            io.to(socket.room_id).emit('actions-locked');
        }
        
        playerStateHandler(data, socket, io);
        deviceHandler(data, socket, io);
        await trackHandler(data, socket, io);
        socket.previousCurrentTrackSoonFinished = socket.currentTrackSoonFinished;
    }

    socket.playerState = data;
    socket.isHandling = true;
    setTimeout(() => handlePlayer(socket, io), POLL_RATE);
}


const trackHandler = async (data, socket, io) => {
    if (data.body.item == null)
        return;

    const room = await Room.get(socket.room_id);

    if (!socket.playerState || (socket.playerState && (socket.playerState.body.item == null || data.body.item.id !== socket.playerState.body.item.id)))
            await changeTrack(data, room, io);       
}

const deviceHandler = (data, socket, io) => {
    if (!data.body.device && (!socket.playerState || data.body.device != socket.playerState.body.device))
        return io.in(socket.room_id).emit('no-device');

    if (socket.playerState && data.body.device.id != socket.playerState.body.device.id)
        return io.in(socket.room_id).emit('device-change');
}

const playerStateHandler = (data, socket, io) => {
    const event = data.body.is_playing
        ? 'player-started'
        : 'player-paused';

    if (!socket.playerState)
        return io.in(socket.room_id).emit(event);

    if (data.body.is_playing != socket.playerState.body.is_playing)
        return io.in(socket.room_id).emit(event);
}

const changeTrack = async (data, room, io) => {
    let currentTrack = {};
    const filteredTracks = room.tracks.filter(track => {
        if (track.uri == data.body.item.uri)
            currentTrack = track;
        return track.uri != data.body.item.uri
    });
    room.tracks = sortTracksByScore(filteredTracks);
    room.played_song_position += 1;

    if(JSON.stringify(currentTrack) !== "{}")
        room.currentTrack = currentTrack;

    await room.save();
    return io.in(room._id).emit('track-changed', currentTrack, room.tracks);
}

module.exports = {
    handlePlayer,
};