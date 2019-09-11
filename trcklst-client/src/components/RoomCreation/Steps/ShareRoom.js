import React from 'react';
import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon
} from 'react-share';

import CreationSteps from '../../../constants/creationSteps';
import Routes from '../../../constants/routes';
import Emojify from 'react-emojione';
import { Button, Row, Col } from 'react-bootstrap';

class ShareRoom extends React.Component {

  onClick = (shareUrl) => {
    navigator.clipboard.writeText(shareUrl).then(function() {
      alert('copied');
    });
  }

  render() {
    if (this.props.currentStep !== CreationSteps.SHARE_ROOM_STEP) {
      return null;
    }

    const shareUrl = Routes.URI + Routes.ROOM + '/' + this.props.room._id;
    const quote = 'Join me on Trcklst to share your songs';
    const buttonStyle = {
      padding: '10px 20px 10px 20px',
      borderRadius: '20px',
      color: '#e899dd',
      backgroundColor: 'white',
      width: '60%',
      marginLeft: '20%',
      display: 'flex',
      justifyContent: 'space-between'
    }

    const spanStyle = {
      textAlign: 'center',
      marginLeft: '20px',
      width: '100%',
    }

    return (
      <div className='share-buttons-container'>
        <Row>
          <Col style={{ marginBottom: '20px' }}>
            <Button onClick={() => this.onClick(shareUrl)} style={buttonStyle}>
              <div>
                <Emojify style={{ height: 32, width: 32 }}>
                  :link:
               </Emojify>
              </div>
              <span style={spanStyle}>Copy link to the tracklist</span>
            </Button>
          </Col>
        </Row>
        <Row>
          <Col style={{ marginBottom: '20px' }}>
            <FacebookShareButton
              style={buttonStyle}
              url={shareUrl}
              quote={quote}>
              <FacebookIcon
                size={32}
                round />
              <span style={spanStyle}>Share on Facebook</span>
            </FacebookShareButton>
          </Col>
        </Row>
        <Row>
          <Col>
            <WhatsappShareButton
              style={buttonStyle}
              url={shareUrl}
              title={quote}
              separator=":">
              <WhatsappIcon size={32} round />
              <span style={spanStyle}>Share on What's app</span>
            </WhatsappShareButton>
          </Col>
        </Row>
      </div>
    )
  }
}

export default ShareRoom;
