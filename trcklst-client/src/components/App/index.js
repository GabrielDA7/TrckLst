import React from "react";
import {
    BrowserRouter as Router,
    Route,
} from "react-router-dom";
import Routes from "../../constants/routes";

import LandingPage from "../Landing";
import SpotifyAuthCallback from "../Auth/Spotify/SpotifyAuthCallback";
import RoomCreation from '../RoomCreation';
import Room from '../Room';



const App = () => (
    <Router>
        <Route exact path={Routes.LANDING} component={LandingPage} />
        <Route path={Routes.SPOTIFY_AUTH} component={SpotifyAuthCallback} />
        <Route path={Routes.CREATE_ROOM} component={RoomCreation} />
        <Route path={Routes.ROOM + '/:id'} component={Room} />
    </Router>
);

export default App;