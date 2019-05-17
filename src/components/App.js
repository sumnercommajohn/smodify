import React from 'react';
import { hot } from 'react-hot-loader/root';
import { authQuery, getTokenFromURI } from '../config/authConfig';
import macaroon from '../assets/img/Macaroonicon.png';


class App extends React.Component {
  state = {
    token: null,
    user: null,
  }

  componentDidMount() {
    const token = getTokenFromURI();
    if (token) {
      this.setToken(token);
      this.getProfile(token);
    }
  }

  setToken = (token) => {
    this.setState({ token });
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
      .then((user) => {
        this.setState({ user });
      });
  }

  renderLoginLink = () => (
    <a href={authQuery}>Login to Spotify</a>
  )

  renderWelcome = () => {
    const displayName = this.state.user.display_name;
    return (
      <h3>Welcome, {displayName}</h3>
    );
  }


  render() {
    return (
      <div className="app">
        <img src={macaroon} alt="" />
        <h1 className="title">Smodify.</h1>
        { this.state.user ? this.renderWelcome() : this.renderLoginLink() }

      </div>
    );
  }
}

export default hot(App);
