import React from "react";
import { Redirect } from 'react-router-dom';

import { Container, Row, Col, Spinner } from 'react-bootstrap';

import ApiRoutes from "../../../constants/apiRoutes";
import Routes from "../../../constants/routes";


class SpotifyAuthCallback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      urlRedirect: ''
    }
  }

  componentDidMount() {
    const url = new URL(window.location.href);
    const state = url.searchParams.get('state');
    const code = url.searchParams.get('code');

    fetch(ApiRoutes.API_URI + ApiRoutes.API_AUTH_REGISTER_ADMIN, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        code: code,
        state: state,
      })
    }).then(data => {
      if (data.status !== 201)
        throw new Error('status code invalid');
      return data.json();
    })
      .then(result => {
        window.localStorage.setItem('jwt-token', result.token);
        this.setState({ urlRedirect: Routes.CREATE_ROOM });
      }).catch(e => {
        this.setState({ urlRedirect: Routes.LANDING });
      });


  }

  render() {
    if (this.state.urlRedirect.length > 0) {
      return <Redirect to={this.state.urlRedirect} />;
    }

    const sectionStyle = {
      'height': '100%',
      'color': 'white',
      'backgroundImage': 'linear-gradient(to bottom, #f65ddb, #f366da, #f16ed9, #ee76d8, #eb7dd7, #ea86d9, #e98fdb, #e897dd, #e9a3e2, #ebaee6, #ecbaea, #eec5ed)',
      'minHeight': '100%',
      'display': 'flex',
      'alignItems': 'center',
    };

    return (
      <section style={sectionStyle}>
        <Container>
          <Row className="text-center">
            <Col>
              <Spinner animation="border" role="status" style={{ height: 56, width: 56 }}>
                <span className="sr-only">Loading...</span>
              </Spinner>
            </Col>
          </Row>
        </Container>
      </section>
    );
  }
}

export default SpotifyAuthCallback;
