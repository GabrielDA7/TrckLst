const APIError = require('./apiError');
const httpStatus = require('http-status');

const handleAuth = (user) => {
    if(!user.spotify_id) {
        throw new APIError('Unauthorized', httpStatus.UNAUTHORIZED, true);
    }
}

module.exports = handleAuth;