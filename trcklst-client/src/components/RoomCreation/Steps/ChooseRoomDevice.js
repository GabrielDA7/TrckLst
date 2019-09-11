import React from 'react';

import CreationSteps from '../../../constants/creationSteps';
import ApiRoutes from '../../../constants/apiRoutes';

import DevicesSelect from '../Form/DevicesSelect';
import RefreshDevicesButton from '../Common/RefreshDevicesButton';

import { Row, Col } from 'react-bootstrap';

class ChooseRoomDevice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: []
    }
  }

  getDevices = (event) => {
    fetch(ApiRoutes.API_URI + ApiRoutes.API_DEVICE, {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('jwt-token')}`,
      }
    })
      .then(data => data.json())
      .then(result => this.setState({ devices: result.devices }))
      .catch(e => console.log(e));
  }

  render() {
    if (this.props.currentStep !== CreationSteps.CHOOSE_DEVICE_STEP) {
      return null;
    }

    return (
      <div>
        <Row>
          <Col xs={9} s={9} m={9} l={9} >
            <DevicesSelect devices={this.state.devices} getDevices={this.getDevices} handleChange={this.props.handleChange} />
          </Col>
          <Col xs={3} s={3} m={3} l={3} className='text-right'>
            <RefreshDevicesButton getDevices={this.getDevices} />
          </Col>
        </Row>
      </div>
    )
  }
}


export default ChooseRoomDevice;
