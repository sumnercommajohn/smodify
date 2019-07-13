import React from 'react';
import { hot } from 'react-hot-loader/root';
import { fetchProfile, fetchSomePlaylists } from '../helpers/spotifyHelpers';
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
      this.getProfile(token);
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

  getProfile = async (token) => {
    try {
      const userProfile = await fetchProfile(token);
      this.setState({
        user: {
          name: userProfile.display_name,
          id: userProfile.id,
          error: false,
          errorMessage: '',
        },
      });
    } catch (error) {
      this.setState({
        user: {
          error: true,
          errorMessage: error.message,
        },
      });
    }
  }

  getUserPlaylists = async (token, endpoint = 'https://api.spotify.com/v1/me/playlists') => {
    const { needsRefresh } = this.state.userPlaylists;
    try {
      const playlistsObject = await fetchSomePlaylists(token, endpoint);
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
    } catch (error) {
      this.setState({
        userPlaylists: {
          error: true,
          errorMessage: error.message,
        },
      });
    }
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

  updateUserPlaylists = (playlist) => {
    const playlistItems = [...this.state.userPlaylists.items];
    const targetIndex = playlistItems.findIndex(playlistItem => playlist.id === playlistItem.id);
    if (targetIndex < 0) {
      playlistItems.unshift(playlist);
    } else {
      playlistItems[targetIndex] = { ...playlist };
    }
    this.setState(prevState => ({
      userPlaylists: {
        ...prevState.userPlaylists,
        items: [...playlistItems],
      },
    }));
  }


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
              fetchUserPlaylists={this.getUserPlaylists}
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
              updateUserPlaylists={this.updateUserPlaylists}
            />
          )
          : <Dashboard errorMessage={user.errorMessage} />
        }


      </div>
    );
  }
}

export default hot(App);
