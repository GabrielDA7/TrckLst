import React from 'react';

import { FaUserFriends } from 'react-icons/fa';
import { Row, Col } from 'react-bootstrap';

import PlayButton from './PlayButton';

const RoomHeader = (props) => {
    const { room, user, socket, isPlaying, clientsCount } = props;

    return (
        <div id='room-header'>
            <Row>
                <Col xs={9} s={10} m={10} l={10}>
                    <h1 style={{ display: 'inline-block' }}>{room.name}</h1>
                    <PlayButton user={user} room={room} socket={socket} isPlaying={isPlaying} />
                </Col>
                <Col xs={3} s={2} m={2} l={2} className="text-right" style={{ lineHeight: '56px' }}>
                    <FaUserFriends style={{ height: '24px', width: '24px' }} />
                    <span style={{ fontSize: '1em', marginLeft: '10px' }}>{clientsCount}</span>
                </Col>
            </Row>
        </div>
    )
}

export default RoomHeader;