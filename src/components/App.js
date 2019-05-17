import React from 'react';
import { hot } from 'react-hot-loader/root';
import { checkURIforError, getTokenFromURI, getAuthQuery } from '../config/authConfig';
import macaroon from '../assets/img/Macaroonicon.png';


class App extends React.Component {
  state = {
    token: null,
    user: null,
    error: false,
  }

  componentDidMount() {
    const error = checkURIforError();
    const token = getTokenFromURI();
    if (token) {
      this.setToken(token);
      this.getProfile(token);
    }
    this.setError(error);
  }

  setToken = (token) => {
    this.setState({ token });
  }

  setError = (error) => {
    this.setState({ error });
  }

  getProfile = (token) => {
    const authToken = token;
    const myHeaders = new Headers();

    myHeaders.append('Authorization', `Bearer ${authToken}`);

    fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: myHeaders,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw Error(`Request rejected with status ${response.status}`);
      })
      .then((userData) => {
        const user = userData.id;
        this.setState({ user });
        this.setState({ error: false });
      })
      .catch(() => this.setState({ error: true }));
  }

  renderLoginLink = () => (
    <a href={getAuthQuery()}>Login to Spotify</a>
  )

  renderWelcome = () => {
    const displayName = this.state.user;
    return (
      <div>

        <h3>Welcome, {displayName}
          <small><a href={getAuthQuery(true)}> (Not You?)</a></small>
        </h3>

      </div>
    );
  }

  renderError = () => (
    <p className="warning">
        Something weird happened. You should try again.
    </p>
  )


  render() {
    return (
      <div className="app">
        <img src={macaroon} alt="" />
        <h1 className="title">Smodify.</h1>
        {this.state.error && this.renderError() }
        { this.state.user ? this.renderWelcome() : this.renderLoginLink() }


      </div>
    );
  }
}

export default hot(App);
