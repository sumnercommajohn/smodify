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
    playlists: {
      items: [],
      nextPlaylistsEndpoint: null,
      error: false,
      errorMessage: '',
    },
    currentPlaylist: {
      name: '',
      tracks: {
        items: [],
      },
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

  fetchUserPlaylists = (token, endpoint = 'https://api.spotify.com/v1/me/playlists') => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);

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

  setCurrentPlaylist = (playlist) => {
    const { currentPlaylist, token } = this.state;
    const selectedPlaylist = { ...playlist };
    if (selectedPlaylist.id !== currentPlaylist.id) {
      this.setState({ currentPlaylist: selectedPlaylist });
    }
  };

  fetchCurrentPlaylistTracks = (token, endpoint) => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);

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
      .then((tracks) => {
        this.setState((prevState) => {
          const existingTracks = prevState.currentPlaylist.tracks.items || [];
          const fetchedTracks = tracks.items;
          return {
            ...prevState,
            currentPlaylist: {
              ...prevState.currentPlaylist,
              tracks: {
                ...tracks,
                items: [...existingTracks, ...fetchedTracks],
              },
              error: false,
              errorMessage: '',
            },
          };
        });
      })
      .catch((error) => {
        this.setState({
          currentPlaylist: {
            error: true,
            errorMessage: error.message,
          },
        });
      });
  };

  render() {
    console.log('App render');
    const {
      user,
      token,
      playlists,
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
              playlists={playlists}
              errorMessage={playlists.errorMessage}
              fetchUserPlaylists={this.fetchUserPlaylists}
              sortPlaylists={this.sortPlaylists}
              setCurrentPlaylist={this.setCurrentPlaylist}
            />
            )
          }
        </Sidebar>
        { currentPlaylist.name
          ? (
            <CurrentPlaylist
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
