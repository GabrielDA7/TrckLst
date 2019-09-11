const SpotifyWebApi = require('./spotifyWebApi');

async function setTokens(user) {
  user = await refreshToken(user);
  SpotifyWebApi.setRefreshToken(user.spotify_refresh_token);
  SpotifyWebApi.setAccessToken(user.spotify_access_token);
  return Promise.resolve(user);
}

async function refreshToken(user) {
  if (user.spotify_token_expires_at.getTime() <= Date.now()) {
    SpotifyWebApi.setRefreshToken(user.spotify_refresh_token);
    const data = await SpotifyWebApi.refreshAccessToken();
    user.spotify_access_token = data.body.access_token;
    user.spotify_token_expires_at = data.body.expires_in * 100;
    const userUpdated = await user.save();
    return Promise.resolve(userUpdated);
  }

  return Promise.resolve(user);
}

module.exports = {
  refreshToken,
  setTokens,
};
