import React from 'react';

import ApiRoutes from '../../../constants/apiRoutes';

import RoomTrackList from '../Common/RoomTrackList';
import { Form, Button } from 'react-bootstrap';
import { FaSearch, FaTimes } from 'react-icons/fa';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            trackListResult: [],
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const searchUrl = ApiRoutes.API_URI + ApiRoutes.API_SEARCH + '/' + this.props.room._id + '/' + this.state.searchText + '/track';
        fetch(searchUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.localStorage.getItem('jwt-token')}`
            }
        })
            .then((data) => data.json())
            .then(trackListResult => {
                this.setState({
                    trackListResult: trackListResult
                });
            });
        return false;
    }

    addTrack = (image, name, artist, uri) => {
        this.props.socket.emit('add-track', {
            image: image,
            name: name,
            artist: artist,
            uri: uri
        });
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    render() {
        const searchStyle = {
            border: '1px solid #dfe1e5',
            borderRadius: '5px',
            width: '100%',
            margin: '0'
        }
        const buttonStyle = { width: '50px', backgroundColor: '#dfe1e5', borderColor: '#dfe1e5', borderRadius: '0 5px 5px 0' };

        const { handleSearch, handleSearchCancel, isSearching } = this.props;
        return (
            <div className='search-container'>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Row style={searchStyle}>
                        <Form.Control
                            style={{ width: 'calc(100% - 70px)', paddingLeft: '10px', paddingRight: '10px', fontStyle: 'normal' }}
                            type='text'
                            name='searchText'
                            autoComplete='off'
                            spellCheck='false'
                            placeholder='Search'
                            onChange={this.handleChange} 
                            onFocus={handleSearchCancel}
                      
                             />

                        {isSearching ?
                            <Button type='button' style={buttonStyle} onClick={handleSearchCancel} >
                                <FaTimes />
                            </Button> :
                            <Button type='submit' style={buttonStyle} onClick={handleSearch}>
                                <FaSearch />
                            </Button>
                        }
                    </Form.Row>
                </Form>
                {isSearching && <RoomTrackList tracks={this.state.trackListResult} isSearch={true} addTrack={this.addTrack} />}
            </div>
        );
    }


}

export default Search;