import React from 'react';
import { Form } from 'react-bootstrap';

class DevicesSelect extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            devices: []
        }
    }

    componentDidMount() {
        const { getDevices } = this.props;
        getDevices();
    }

    render() {
        const devices = this.props.devices;
        const optionItems = devices.map((device) => <option key={device.id} value={device.id}>{device.name}</option>);

        return (
            <div>
                <Form.Group controlId='device'>
                    <Form.Control name='device' onChange={this.props.handleChange} className='creation-input-select' as='select'>
                        <option value='0'>-- no device --</option>
                        {optionItems}
                    </Form.Control>
                </Form.Group>
            </div>
        )
    }
}

export default DevicesSelect;