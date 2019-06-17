import React from 'react';
import { hot } from 'react-hot-loader/root';
import { checkURIforError, getTokenFromURI } from '../config/authConfig';
import { Dashboard } from './Dashboard';
import { UserPlaylists } from './UserPlaylists';
import { Sidebar } from './Sidebar';
import { Welcome } from './Welcome';
import { LoginLink } from './LoginLink';


class App extends React.Component {
  state = {
    token: '',
    user: {
      name: '',
      id: '',
      error: false,
      errorMessage: '',
    },
    playlists: {
      items: [],
      nextPlaylistsEndpoint: null,
      error: false,
      errorMessage: '',
    },
  }

  componentDidMount() {
    const authError = checkURIforError();
    const token = getTokenFromURI();
    this.setAuthError(authError);
    if (token) {
      this.setToken(token);
      this.fetchProfile(token);
      this.fetchPlaylists(token);
    }
  }

  componentDidUpdate() {
    const { token, playlists: { nextPlaylistsEndpoint } } = this.state;
    if (nextPlaylistsEndpoint) {
      this.fetchPlaylists(token, nextPlaylistsEndpoint);
    }
  }

  setToken = (token) => {
    this.setState({ token });
  }

  setAuthError = (error) => {
    const errorMessage = error
      ? 'Profile access revoked by user.'
      : '';
    this.setState(prevState => ({
      ...prevState,
      user: {
        error,
        errorMessage,
      },
    }));
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
        this.setState(prevState => ({
          ...prevState,
          user: {
            name,
            id,
            error: false,
            errorMessage: '',
          },
        }));
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

  fetchPlaylists = (token, endpoint = 'https://api.spotify.com/v1/me/playlists') => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);
    console.log('Hi');

    fetch(endpoint, {
      method: 'GET',
      headers: myHeaders,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw Error(`Request rejected with status ${response.status}`);
      })
      .then((playlistsObject) => {
        this.setState(prevState => ({
          ...prevState,
          playlists: {
            items: [...prevState.playlists.items, ...playlistsObject.items],
            nextPlaylistsEndpoint: playlistsObject.next,
            error: false,
            errorMessage: '',
          },
        }));
      })
      .catch((error) => {
        this.setState({
          playlists: {
            error: true,
            errorMessage: error.message,
          },
        });
      });
  }

  sortPlaylists = (sortBy, sortDescending) => {
    const { items } = this.state.playlists;
    const playlistsMap = items.map((playlist, i) => ({
      index: i,
      name: playlist.name.toLowerCase(),
      total: playlist.tracks.total,
    }));
    playlistsMap.sort((a, b) => {
      if (a[`${sortBy}`] > b[`${sortBy}`]) {
        return 1;
      }
      if (a[`${sortBy}`] < b[`${sortBy}`]) {
        return -1;
      }
      return 0;
    });
    if (sortDescending) {
      playlistsMap.reverse();
    }
    const playlistsSorted = playlistsMap.map(mapItem => items[mapItem.index]);
    this.setState(prevState => ({
      ...prevState,
      playlists: {
        items: [...playlistsSorted],
      },
    }));
  };


  render() {
    const {
      user,
      playlists,
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
              playlists={playlists.items}
              errorMessage={playlists.errorMessage}
              sortPlaylists={this.sortPlaylists}
              setCurrentPlaylist={this.setCurrentPlaylist}
            />
            )
          }
        </Sidebar>

        <Dashboard errorMessage={user.errorMessage} />

      </div>
    );
  }
}

export default hot(App);
