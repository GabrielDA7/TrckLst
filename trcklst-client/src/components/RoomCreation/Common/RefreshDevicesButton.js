import React from 'react';

import { Button } from 'react-bootstrap';
import Emojify from 'react-emojione';

const RefreshDevicesButton = (props) => {
    return <Button type='button' onClick={props.getDevices}>
        <Emojify style={{height: 24, width: 24}}>
            :dizzy:
        </Emojify>
    </Button>
}

export default RefreshDevicesButton;