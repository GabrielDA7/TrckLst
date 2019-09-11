import React from 'react';
import io from 'socket.io-client';
import decode from 'jwt-decode';

import ApiRoutes from '../../constants/apiRoutes';

import RoomHeader from './Common/RoomHeader';
import RoomTrackList from './Common/RoomTrackList';
import Search from './Form/Search';
import CurrentTrack from './Common/CurrentTrack';

import { Container } from 'react-bootstrap';

class Room extends React.Component {
    _timeoutID;

    constructor(props) {
        super(props);
        this.state = {
            user: {},
            room: {},
            trackList: [],
            clientsCount: 0,
            currentTrack: {},
            isPlaying: false,
            lock: false,
            isSearching: false,
        };
    }

    registerGuestUser() {
        return fetch(ApiRoutes.API_URI + ApiRoutes.API_AUTH_REGISTER_GUEST, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(data => data.json())
            .then(result => window.localStorage.setItem('jwt-token', result.token))
    }

    getRoom(roomId) {
        return fetch(ApiRoutes.API_URI + ApiRoutes.API_ROOM + '/' + roomId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.localStorage.getItem('jwt-token')}`
            }
        })
            .then(data => data.json())
            .then(room => {
                this.initSocket(room);
                this.socket.emit('get-current-track');
                console.log(room);
                this.setState({ room: room, trackList: room.tracks,currentTrack: room.currentTrack,  user: decode(window.localStorage.getItem('jwt-token')) });
            });
    }

    initSocket(room) {
        this.socket = io.connect(ApiRoutes.API_URI, {
            query: {
                token: window.localStorage.getItem('jwt-token')
            }
        });

        this.socket.emit('join-room', {
            room_id: room._id
        });

        this.socket.on('update-clients-count', (data) => {
            this.setState({ clientsCount: data });
        });

        this.socket.on('tracks-updated', (trackListUpdated) => {
            this.setState({
                trackList: trackListUpdated
            });
        });

        this.socket.on('track-changed', (currentTrack, trackList) => {
            this.setState({ currentTrack: currentTrack, trackList: trackList });
        });

        this.socket.on('player-started', () => {
            this.setState({ isPLaying: true });
        });

        this.socket.on('player-paused', () => {
            this.setState({ isPLaying: false });
        });

        this.socket.on('actions-locked', () => {
            this.setState({ lock: true });
        });

        this.socket.on('actions-unlocked', () => {
            this.setState({ lock: false });
        });

        this.socket.on('current-track', (currentTrack) => {
            this.setState({ currentTrack: currentTrack });
        });
    }

    initGuest(roomId) {
        this.registerGuestUser()
            .then(() => this.getRoom(roomId))
            .catch(e => console.log(e));
    }

    upVote = (image, name, artist, uri) => {
        this.socket.emit('upvote', {
            image,
            name,
            artist,
            uri
        });
    }


    componentDidMount() {
        let roomId = this.props.match.params.id;
        if (window.localStorage.getItem('jwt-token')) {
            this.getRoom(roomId);
        } else {
            this.initGuest(roomId);
        }
    }

    handleSearch = () => {
        this._timeoutID = setTimeout(() => {
            if (!this.state.isSearching) {
                this.setState({ isSearching: true })
            }
          }, 0);
    }

    handleSearchCancel = () => {
        clearTimeout(this._timeoutID);
        if (this.state.isSearching) {
            this.setState({
                isSearching: false,
            });
        }
    }

    render() {
        return (
            <div id="room">
                <Container>
                    <RoomHeader user={this.state.user} room={this.state.room} socket={this.socket} isPlaying={this.state.isPlaying} clientsCount={this.state.clientsCount} isSearching={this.state.isSearching} />
                    <Search room={this.state.room} socket={this.socket} isSearching={this.state.isSearching} handleSearch={this.handleSearch} handleSearchCancel={this.handleSearchCancel} />
                    {!this.state.isSearching && <RoomTrackList tracks={this.state.trackList} isSearch={false} upVote={this.upVote} lock={this.state.lock}  />}
                    <CurrentTrack track={this.state.currentTrack} isPlaying={this.state.isPlaying} />
                </Container>
            </div>
        )
    }
}

export default Room;