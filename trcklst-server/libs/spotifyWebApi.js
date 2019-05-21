const SpotifyWebApi = require('spotify-web-api-node');
const config = require('../config');

module.exports = new SpotifyWebApi({
  clientId: config.spotify.clientId,
  clientSecret: config.spotify.clientSecret,
  redirectUri: config.spotify.redirectUrl,
});
