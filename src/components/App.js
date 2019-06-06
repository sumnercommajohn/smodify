import React from 'react';
import { hot } from 'react-hot-loader/root';
// import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { checkURIforError, getTokenFromURI } from '../config/authConfig';
import { Dashboard } from './Dashboard';
import { Welcome } from './Welcome';
import { LoginLink } from './LoginLink';


class App extends React.Component {
  state = {
    token: '',
    user: '',
    error: false,
    errorMessage: '',
  }

  componentDidMount() {
    const authError = checkURIforError();
    const token = getTokenFromURI();
    this.setAuthError(authError);
    if (token) {
      this.setToken(token);
      this.getProfile(token);
      this.getPlaylists(token);
    }
  }

  setToken = (token) => {
    this.setState({ token });
  }

  setAuthError = (error) => {
    const errorMessage = error
      ? 'Access denied by user'
      : '';
    this.setState({ error, errorMessage });
  }

  getProfile = (token) => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);

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
        console.log(userData);
        const user = userData.display_name;
        this.setState(prevState => ({
          ...prevState,
          user,
          error: false,
          errorMessage: '',
        }));
      })
      .catch((error) => {
        this.setState({
          error: true,
          errorMessage: error.message,
        });
      });
  }

  getPlaylists = (token) => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);

    fetch('https://api.spotify.com/v1/me/playlists', {
      method: 'GET',
      headers: myHeaders,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw Error(`Request rejected with status ${response.status}`);
      })
      .then((playlists) => {
        console.log(playlists);
        this.setState(prevState => ({
          ...prevState,
          playlists,
          error: false,
          errorMessage: '',
        }));
      })
      .catch((error) => {
        this.setState({
          error: true,
          errorMessage: error.message,
        });
      });
  }


  render() {
    const {
      errorMessage,
      user,
      playlists,
    } = this.state;
    return (
      <div className="app">
        <nav className="sidebar">
          <h2>Sidebar</h2>
          { user ? <Welcome user={user} /> : <LoginLink message="Login to Spotify" /> }
        </nav>

        <Dashboard playlists={playlists} errorMessage={errorMessage} />

      </div>
    );
  }
}

export default hot(App);
