import React from 'react';

import ApiRoutes from '../../constants/apiRoutes';

import Emojify from 'react-emojione';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { FaSpotify } from 'react-icons/fa';

class Landing extends React.Component {
    state = {
        authUrl: ''
    }

    componentDidMount() {
        fetch(ApiRoutes.API_URI + ApiRoutes.API_AUTH_GET_URL, { credentials: 'include' })
            .then(result => result.json())
            .then(data => this.setState({ authUrl: data.url }))
            .catch(error => console.log(error));
    }

    handleClick = () => {
        window.location = this.state.authUrl;
    }

    render() {
        const enableButton = this.state.authUrl.length > 0;

        const sectionStyle = {
            'height': '100%',
            'color': 'white',
            'backgroundImage': 'linear-gradient(to bottom, #f65ddb, #f366da, #f16ed9, #ee76d8, #eb7dd7, #ea86d9, #e98fdb, #e897dd, #e9a3e2, #ebaee6, #ecbaea, #eec5ed)',
            'minHeight': '100%',
            'display': 'flex',
            'alignItems': 'center',
        };

        return (
            <section style={sectionStyle} >
                <Container>
                    <Row>
                        <Col>
                            <Row>
                                <Col className="text-center">
                                    <h1>Trcklst.</h1>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="text-center">
                                    <p>
                                        <Emojify style={{ height: 24, width: 24 }}>
                                            :thumbsup:
                                </Emojify>
                                        Let the group decide
                                <Emojify style={{ height: 24, width: 24 }}>
                                            :thumbsdown:
                                </Emojify>
                                    </p>
                                </Col>
                            </Row>
                            <Row className="justify-content-center">
                                <Button variant="success" disabled={!enableButton} onClick={this.handleClick} style={{padding: '10px 20px 10px 10px'}}>
                                    <FaSpotify style={{height:'24px', width: '24px', marginRight:'10px', color: 'white'}} />
                                    LOG IN
                                </Button>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </section >
        )
    }
}


export default Landing;