import React from 'react';

import TrackRow from './TrackRow';

const RoomTrackList = (props) => {
    const { tracks, isSearch, lock } = props;

    const addTrackListener = isSearch && props.addTrack;
    const upVoteListener = !isSearch && props.upVote;
    
    const tracksList = tracks.map((track, i) => {
        return <TrackRow key={track.uri} track={track} isNext={i === 0} isSearch={isSearch} addTrack={addTrackListener} upVote={upVoteListener} lock={lock} />
    });

    return (
        <div style={{marginTop: 20}}>
            {isSearch && <h3>Tracks</h3>}
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {tracksList.length ?
                    tracksList :
                    !isSearch ? <h3>No tracks yet !</h3> : null}
            </ul>
        </div>
    )
}

export default RoomTrackList;