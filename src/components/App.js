import React from 'react';
import { hot } from 'react-hot-loader/root';
import { checkURIforError, getTokenFromURI } from '../config/authConfig';
import { Dashboard } from './Dashboard';
import { Sidebar } from './Sidebar';
import { Welcome } from './Welcome';
import { LoginLink } from './LoginLink';
import UserPlaylists from './UserPlaylists';
import CurrentPlaylist from './CurrentPlaylist';


class App extends React.Component {
  state = {
    token: '',
    user: {
      name: '',
      id: '',
      error: false,
      errorMessage: '',
    },
    currentPlaylist: {
      name: '',

    },
  }

  componentDidMount() {
    const authError = checkURIforError();
    const token = getTokenFromURI();
    this.setAuthError(authError);
    if (token) {
      console.log('setting token...');
      this.setToken(token);
      console.log('fetching profile...');
      this.fetchProfile(token);
    }
  }


  setToken = (token) => {
    this.setState({ token });
  }

  setAuthError = (error) => {
    const errorMessage = error
      ? 'Profile access revoked by user.'
      : '';
    this.setState({
      user: {
        error,
        errorMessage,
      },
    });
  }

  fetchProfile = (token) => {
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
        const { id, display_name: name } = userData;
        this.setState({
          user: {
            name,
            id,
            error: false,
            errorMessage: '',
          },
        });
      })
      .catch((error) => {
        this.setState({
          user: {
            error: true,
            errorMessage: error.message,
          },
        });
      });
  }


  setCurrentPlaylist = (playlist) => {
    const { currentPlaylist, token } = this.state;
    const selectedPlaylist = { ...playlist };
    if (selectedPlaylist.id !== currentPlaylist.id) {
      console.log(`setting ${selectedPlaylist.name} as CurrentPlaylist...`);
      this.setState({ currentPlaylist: selectedPlaylist });
      console.log(`fetching ${selectedPlaylist.name}'s tracks`);
    }
  };


  render() {
    console.log('App render');
    const {
      user,
      token,
      currentPlaylist,
    } = this.state;
    return (
      <div className="app">
        <Sidebar>
          { user.name
            ? <Welcome user={user.name} />
            : <LoginLink message="Login to Spotify to get started." />
            }
          { user.name
            && (
            <UserPlaylists
              token={token}
              setCurrentPlaylist={this.setCurrentPlaylist}
            />
            )
          }
        </Sidebar>
        { currentPlaylist.name
          ? (
            <CurrentPlaylist
              key={currentPlaylist.id}
              playlist={currentPlaylist}
              fetchCurrentPlaylistTracks={this.fetchCurrentPlaylistTracks}
              token={token}
            />
          )
          : <Dashboard errorMessage={user.errorMessage} />
        }


      </div>
    );
  }
}

export default hot(App);
