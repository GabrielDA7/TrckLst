import React from 'react';

import CreationSteps from '../../../constants/creationSteps';

import '../Form/form.css';

import { Form } from 'react-bootstrap';


const ChooseRoomName = (props) => {
  if (props.currentStep !== CreationSteps.CHOOSE_NAME_STEP) {
    return null
  }

  return (
    <Form.Group controlId='choose-room-name-step'>
      <Form.Control
        className="creation-input-text"
        name="name"
        type="text"
        placeholder="Untitled"
        autoComplete="off"
        spellCheck="false"
        value={props.name}
        onChange={props.handleChange}
      />
    </Form.Group>
  )
}


export default ChooseRoomName;
