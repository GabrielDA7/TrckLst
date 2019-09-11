import React from 'react';

import ApiRoutes from '../../../constants/apiRoutes';
import { Button } from 'react-bootstrap';
import { FaPlay, FaPause } from 'react-icons/fa';

class PlayButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstPlay: true,
            isPlaying: false,
        }
    }
    handleClick = () => {
        const url = ApiRoutes.API_URI + ApiRoutes.API_ROOM + `/${this.props.room._id}/${this.state.isPlaying ? 'pause' : 'play'}`;
        fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.localStorage.getItem('jwt-token')}`
            }
        }).then(data => {
            if (data.status !== 204) {
                throw new Error('play failed');
            }
        }).then(() => {
            if (this.state.firstPlay) {
                this.props.socket.emit('handle-playlist');
                this.setState({ firstPlay: false, isPlaying: true });
            } else {
                this.setState({ isPlaying: this.state.isPlaying ? false : true });
            }
        })
            .catch(e => console.log(e));
    }

    render() {
        if (!this.props.user || !(this.props.user._id === this.props.room.owner_id)) {
            return null;
        }
        return <Button style={{marginBottom: '1em', marginLeft: '1em'}}onClick={this.handleClick}>{this.state.isPlaying ? <FaPause style={{height: '24px', width: '24px'}} /> : <FaPlay style={{height: '24px', width: '24px'}} />}</Button>
    }
}

export default PlayButton;