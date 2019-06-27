import React from 'react';
import { hot } from 'react-hot-loader/root';
import { checkURIforError, getTokenFromURI, getTokenFromLocal } from '../config/authConfig';
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
    userPlaylists: {
      items: [],
      nextPlaylistsEndpoint: null,
      error: false,
      errorMessage: '',
      needsRefresh: false,
    },
  }

  componentDidMount() {
    let token = getTokenFromURI();
    const authError = checkURIforError();
    if (!token) {
      token = getTokenFromLocal();
    }
    this.setAuthError(authError);
    if (token) {
      this.setState({ token });
      this.fetchProfile(token);
    }
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
        const { needsRefresh } = this.state.userPlaylists;
        this.setState((prevState) => {
          const existingItems = needsRefresh
            ? []
            : prevState.userPlaylists.items;
          return {
            userPlaylists: {
              items: [...existingItems, ...playlistsObject.items],
              nextPlaylistsEndpoint: playlistsObject.next,
              error: false,
              errorMessage: '',
              needsRefresh: false,
            },
          };
        });
        console.log(this.state.userPlaylists);
      })
      .catch((error) => {
        this.setState({
          userPlaylists: {
            error: true,
            errorMessage: error.message,
          },
        });
      });
  }

  sortPlaylists = (sortBy, sortDescending = false) => {
    const { items } = this.state.userPlaylists;
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
    this.setState(prevstate => ({
      userPlaylists: {
        ...prevstate.userPlaylists,
        items: [...playlistsSorted],
      },
    }));
  };

  refreshPlaylists = () => {
    this.setState(prevstate => ({
      userPlaylists: {
        ...prevstate.userPlaylists,
        needsRefresh: true,
      },
    }));
  }

  setCurrentPlaylist = (playlist) => {
    const { currentPlaylist } = this.state;
    const selectedPlaylist = { ...playlist };
    if (selectedPlaylist.id !== currentPlaylist.id) {
      this.setState({ currentPlaylist: selectedPlaylist });
    }
  };


  render() {
    const {
      user,
      token,
      currentPlaylist,
      userPlaylists,
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
              userPlaylists={userPlaylists}
              setCurrentPlaylist={this.setCurrentPlaylist}
              fetchUserPlaylists={this.fetchUserPlaylists}
              sortPlaylists={this.sortPlaylists}
            />
            )
          }
        </Sidebar>
        { currentPlaylist.name
          ? (
            <CurrentPlaylist
              key={currentPlaylist.id}
              playlist={currentPlaylist}
              token={token}
              refreshPlaylists={this.refreshPlaylists}
              userId={user.id}
              setCurrentPlaylist={this.setCurrentPlaylist}
            />
          )
          : <Dashboard errorMessage={user.errorMessage} />
        }


      </div>
    );
  }
}

export default hot(App);
