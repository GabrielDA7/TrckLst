import React from 'react';

import { Image, Row, Col } from 'react-bootstrap';
import Emojify from 'react-emojione';

import './track_row.css';

const TrackRow = (props) => {
    const { track, isNext, isSearch, lock } = props;
    return (
        <li className='track-row' style={{ marginTop: '20px' }}>
            <Row>
                <Col xs={4} s={3} m={2} l={2}>
                    <div style={{position: 'relative', display: 'inline-block'}}>
                        <Image src={track.image} alt='Track poster' rounded style={{ width: '100px' }} />
                        {!isSearch && isNext && <span className='next-track'>Next</span>}
                    </div>
                </Col>
                <Col xs={5} s={6} m={7} l={7} className='align-self-center'>
                    <span style={{ display: 'block' }}>{track.name}</span>
                    <span style={{ display: 'block', color: '#6b778d' }}>{track.artist}</span>
                </Col>
                <Col xs={3} s={3} m={2} l={2} className='align-self-center text-right'>
                    {isSearch ?
                        <button disabled={lock} className={lock ? "button-link-disabled" : 'button-link-enabled'} onClick={() => props.addTrack(track.image, track.name, track.artist, track.uri)}>Add</button>
                        : <button className='upvote-button' onClick={() => props.upVote(track.image, track.name, track.artist, track.uri)} disabled={lock}>
                            <span>{track.score}</span>
                            <Emojify style={{ height: 16, width: 16, marginLeft: '10px' }}>
                                {lock ? ':no_entry_sign:' : ':thumbsup:'}
                            </Emojify>
                        </button>}
                </Col>
            </Row>
        </li >
    )
}

export default TrackRow;