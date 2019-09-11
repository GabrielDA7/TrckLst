const { setTokens } = require('./spotifyTokenManger');
const SpotifyWebApi = require('./spotifyWebApi');

const getIndexTrack = (tracks, trackUri) => {
    return tracks.findIndex(item => item.uri === trackUri);
}

const shouldReorderPlaylist = (previousTrackIndex, nextTrackIndex) => {
    if (previousTrackIndex == nextTrackIndex)
        return false;
    return true;
}

const sortTracksByScore = (tracks) => {
    return tracks.sort(function (a, b) {
        return b.score - a.score
    });
}

const trackAlreadyExist = (roomTracks, track) => {
    const trackFounded = roomTracks.find(trackRoom => trackRoom.uri === track.uri);
    if (trackFounded)
        return true;
    return false;
}

const removeTrackPlayed = (tracks, playedSongPosition) => {
    return tracks.slice(playedSongPosition);
}

const reorderSpotifyPlaylist = async (owner, room, previousTrackIndex, nextTrackIndex, tracksListUpdated) => {
    const currentPlayedTrack = (room.played_song_position != 0 && room.played_song_position != -1) ? room.played_song_position : room.played_song_position == 0 ? 1 : 0; 
    const rangeStart = previousTrackIndex + currentPlayedTrack;
    const insertBefore = nextTrackIndex + currentPlayedTrack;
 
    try {
        await setTokens(owner);
        await SpotifyWebApi.reorderTracksInPlaylist(room.spotify_playlist_id, rangeStart, insertBefore);
    } catch(e) {
        console.log(e);
    };
    
    return Promise.resolve(tracksListUpdated);
}

module.exports = {
    sortTracksByScore,
    removeTrackPlayed,
    trackAlreadyExist,
    sortTracksByScore,
    reorderSpotifyPlaylist,
    shouldReorderPlaylist,
    getIndexTrack
}