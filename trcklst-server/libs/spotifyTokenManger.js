const SpotifyWebApi = require('./spotifyWebApi');

function setTokens(user) {
  return refreshToken(user)
    .then((userUpdated) => {
      SpotifyWebApi.setRefreshToken(userUpdated.spotify_refresh_token);
      SpotifyWebApi.setAccessToken(userUpdated.spotify_access_token);
      return Promise.resolve(userUpdated);
    }).catch((e) => Promise.reject(e));
}

function refreshToken(user) {
  if (user.spotify_token_expires_at.getTime() <= Date.now()) {
    SpotifyWebApi.setRefreshToken(user.spotify_refresh_token);
    return SpotifyWebApi.refreshAccessToken().then((data) => {
      user.spotify_access_token = data.body.access_token;
      user.spotify_token_expires_at = data.body.expires_in * 100;
      return user.save()
        .then(userUpdated => Promise.resolve(userUpdated))
        .catch((e) => Promise.reject(e));
    }).catch(e => Promise.reject(e));
  }

  return Promise.resolve(user);
}

module.exports = {
  refreshToken,
  setTokens,
};
