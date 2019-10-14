const { handlePlayer } = require('../libs/playerHandler');
const voteHandler = require('../libs/voteHandler');
const trackHandler = require('../libs/trackHandler');
const errorHandler = require('../libs/socketErrorHandler');
const MutexRoom = require('../libs/mutexRoom');
const MutexRoomUser = require('../libs/mutexRoomUser');

const Room = require('../models/room.model');
const User = require('../models/user.model');

const mutexAddTrack = new MutexRoom();
const mutexUpvote = new MutexRoomUser();

module.exports = function (socket, io) {
  socket.on('join-room', function (attrs) {
    initSocket(attrs, socket, io);

    socket.on('get-current-track', function () {
      if (socket.currentTrack && JSON.stringify(socket.currentTrack) !== "{}") {
        socket.emit('current-track', socket.currentTrack);
      }
    });

    socket.on('handle-playlist', async function () {
      if (!socket.isHandling && socket.decoded_token._id == socket.room_owner._id) {
        try {
          await handlePlayer(socket, io);
          socket.isHandling = true;
        } catch (e) {
          errorHandler(e);
        }
      }
    });

    socket.on('add-track', async function (track) {
      try {
        await mutexAddTrack.lock(socket.room_id);
        if (!socket.currentTrackSoonFinished) {
          const tracksUpdated = await trackHandler.addTrack(socket, track);
          io.to(socket.room_id).emit('tracks-updated', tracksUpdated);
        }
        mutexAddTrack.release(socket.room_id);
      } catch (e) {
        errorHandler(e);
        mutexAddTrack.release(socket.room_id);
      }
    });

    socket.on('upvote', async function (track) {
      try {
        mutexUpvote.lock(socket.room_id, socket.decoded_token._id)
        if (!socket.currentTrackSoonFinished) {
          const tracksUpdated = await voteHandler.upVote(socket, track);
          io.to(socket.room_id).emit('tracks-updated', tracksUpdated);
        }
        mutexUpvote.release(socket.room_id, socket.decoded_token._id)
      } catch (e) {
        errorHandler(e);
        mutexUpvote.release(socket.room_id, socket.decoded_token._id)
      }
    });

    socket.on('disconnect', function () {
      if (io.sockets.adapter.rooms[socket.room_id] !== undefined) {
        io.to(socket.room_id).emit("update-clients-count", io.sockets.adapter.rooms[socket.room_id].length);
      } else {
        io.to(socket.room_id).emit("update-clients-count", 0);
      }
    });
  });
}

async function initSocket(attrs, socket, io) {
  try {
    const room = await Room.get(attrs.room_id);
    socket.room_id = room._id;
    socket.currentTrack = room.currentTrack;
    socket.spotify_playlist_id = room.spotify_playlist_id;
    const owner = await User.get(room.owner_id);
    socket.room_owner = owner;
    socket.join(room._id);
    io.to(socket.room_id).emit('update-clients-count', io.sockets.adapter.rooms[room._id].length);
  } catch (e) {
    errorHandler(e);
  }
}