import React from 'react';
import { Redirect } from 'react-router-dom';

import ChooseRoomName from './Steps/ChooseRoomName';
import ChooseRoomDevice from './Steps/ChooseRoomDevice';
import ShareRoom from './Steps/ShareRoom';
import HeaderShare from './Common/HeaderShare';
import HeaderCreate from './Common/HeaderCreate';

import CreationSteps from '../../constants/creationSteps';
import ApiRoutes from '../../constants/apiRoutes';
import Routes from '../../constants/routes';

import Emojify from 'react-emojione';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

class RoomCreation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentStep: CreationSteps.CHOOSE_NAME_STEP,
            name: '',
            device: '',
            room: {},
            redirectUrl: ''
        }
    }

    createRoom = (event) => {
        event.preventDefault();
        const { name, device } = this.state;

        fetch(ApiRoutes.API_URI + ApiRoutes.API_ROOM, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.localStorage.getItem('jwt-token')}`
            },
            body: JSON.stringify({
                name: name,
                device_id: device,
            })
        })
            .then(data => data.json())
            .then(result => this.setState({ room: result }));

        this._next();
        return false;
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    redirectRoom = () => {
        this.setState({ redirectUrl: Routes.ROOM + '/' + this.state.room._id });
    }

    _next = () => {
        let currentStep = this.state.currentStep;

        currentStep = currentStep >= CreationSteps.CHOOSE_DEVICE_STEP ? CreationSteps.SHARE_ROOM_STEP : currentStep + 1;
        this.setState({
            currentStep: currentStep
        });
    }

    _prev = () => {
        let currentStep = this.state.currentStep;

        currentStep = currentStep <= CreationSteps.CHOOSE_NAME_STEP ? CreationSteps.CHOOSE_NAME_STEP : currentStep - 1;
        this.setState({
            currentStep: currentStep
        })
    }

    get previousButton() {
        let currentStep = this.state.currentStep;
    
        if (currentStep > CreationSteps.CHOOSE_NAME_STEP && currentStep < CreationSteps.SHARE_ROOM_STEP) {
            return (
                <Col className="text-left">
                    <Button
                        style={{width: '100%'}}
                        type="button" onClick={this._prev}>
                        <Emojify style={{ height: 24, width: 24 }}>
                            :point_left:
                        </Emojify>
                        Previous
                    </Button>
                </Col>
            )
        }

        return null;
    }

    get createButton() {
        let currentStep = this.state.currentStep;
        if (currentStep === CreationSteps.CHOOSE_DEVICE_STEP) {
            return (
                <Col className="text-right">
                    <Button type="submit" onClick={this.createRoom} style={{ width: '100%' }}>
                        Next
                    <Emojify style={{ height: 24, width: 24 }}>
                            :point_right:
                    </Emojify>
                    </Button>
                </Col>
            )
        }
        return null;
    }

    get nextButton() {
        let currentStep = this.state.currentStep;
        if (currentStep < CreationSteps.CHOOSE_DEVICE_STEP) {
            return (
                <Col>
                    <Button type="button" onClick={this._next} style={{ width: '100%' }} >
                        Next
                        <Emojify style={{ height: 24, width: 24 }}>
                            :point_right:
                        </Emojify>
                    </Button>
                </Col>
            )
        }

        return null;
    }

    get enterRoomButton() {
        let currentStep = this.state.currentStep;
        if (currentStep === CreationSteps.SHARE_ROOM_STEP) {
            return (
                <Col>
                    <Button
                        style={{width: '100%'}}
                        type="button" onClick={this.redirectRoom}>
                        Start the party
                        <Emojify style={{ height: 24, width: 24 }}>
                            :love_you_gesture:
                        </Emojify>
                    </Button>
                </Col>
            )
        }

        return null;
    }

    render() {
        let header = (this.state.currentStep === CreationSteps.SHARE_ROOM_STEP) ? <HeaderShare /> : <HeaderCreate />;
        const sectionStyle = {
            'height': '100%',
            'color': 'white',
            'backgroundImage': 'linear-gradient(to bottom, #f65ddb, #f366da, #f16ed9, #ee76d8, #eb7dd7, #ea86d9, #e98fdb, #e897dd, #e9a3e2, #ebaee6, #ecbaea, #eec5ed)',
            'minHeight': '100%',
            'paddingTop': '5%'
        };

        return (
            <React.Fragment>
                <section id='room-creation' style={sectionStyle}>
                    <Container>
                        <Row>
                            <Col>
                                {header}
                            </Col>
                        </Row>

                        {this.state.currentStep === CreationSteps.CHOOSE_NAME_STEP || this.state.currentStep === CreationSteps.CHOOSE_DEVICE_STEP ?
                            <Row  style={{marginTop: '10%'}}> 
                                <Col>
                                    <Form onSubmit={this.handleSubmit}>
                                        <ChooseRoomName
                                            currentStep={this.state.currentStep}
                                            handleChange={this.handleChange}
                                            name={this.state.name}
                                        />
                                        <ChooseRoomDevice
                                            currentStep={this.state.currentStep}
                                            handleChange={this.handleChange}
                                            device={this.state.device}
                                        />
                                    </Form>
                                </Col>
                            </Row> : null}

                        <Row  style={{marginTop: '10%'}}>
                            <Col>
                                <ShareRoom
                                    currentStep={this.state.currentStep}
                                    room={this.state.room}
                                />
                            </Col>
                        </Row>

                        <div className='fixed-bottom' style={{ bottom: '80px' }}>
                            <Container>
                                <Row>
                                    {this.previousButton}
                                    {this.nextButton}
                                    {this.createButton}
                                    {this.enterRoomButton}
                                </Row>
                            </Container>
                        </div>
                    </Container>
                </section>
                {this.state.redirectUrl.length > 0 && <Redirect to={this.state.redirectUrl} />}
            </React.Fragment>
        )
    }
}

export default RoomCreation;