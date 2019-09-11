const ioJwt = require('socketio-jwt');
const config = require('../config');

const sockets = function (io) {
    io.use(ioJwt.authorize({
        secret: config.jwtSecret,
        handshake: true
    }));

    io.sockets.on('connection', function (socket) {
        require('./room.socket')(socket, io);
    });
}

module.exports = sockets;