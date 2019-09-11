import React from 'react';
import { Container, Image, Row, Col } from 'react-bootstrap';
import Emojify from 'react-emojione';

const CurrentTrack = (props) => {
    if (JSON.stringify(props.track) === "{}" || props.track === undefined) {
        return null;
    }

    return (
        <div className='fixed-bottom' style={{ bottom: 10 }}>
            <Container>
                <Row>
                    <Col>
                        <div style={{ backgroundColor: 'pink', padding: 17, borderRadius: 10 }}>
                            <Row>
                                <Col xs={4} s={3} m={2} l={2} className='align-self-center'>
                                    <Image src={props.track.image} alt='Track poster' rounded style={{ width: '80px' }} />
                                </Col>
                                <Col xs={5} s={6} m={7} l={7} className='align-self-center'>
                                    <div>
                                        <span style={{ color: '#801336', fontSize: 12 }}>Now playing</span>
                                        <Emojify style={{ height: 14, width: 14, marginLeft: 10 }}>
                                            :fire:
                                        </Emojify>
                                    </div>
                                    <div style={{ fontSize: 12 }}>
                                        <span>{props.track.name}</span><span> • </span><span>{props.track.artist}</span>
                                    </div>
                                </Col>
                                <Col xs={3} s={3} m={2} l={2} className='align-self-center'>
                                    <div style={{ display: 'inline-block', borderRadius: 60, boxShadow: '0px 0px 3px white', padding: '0.7em 0.8em' }}>
                                        <Emojify style={{ height: 24, width: 24 }}>
                                            :person_gesturing_no:
                                        </Emojify>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default CurrentTrack;