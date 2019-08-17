import React from 'react';
import { hot } from 'react-hot-loader/root';
import { fetchProfile, fetchSomePlaylists, unfollowPlaylist } from '../helpers/spotifyHelpers';
import { checkURIforError, getTokenFromURI, getTokenFromLocal } from '../helpers/authHelpers';
import { Dashboard } from './Dashboard';
import { Sidebar } from './Sidebar';
import { Welcome } from './Welcome';
import { LoginLink } from './LoginLink';
import UserPlaylists from './UserPlaylists';
import CurrentPlaylist from './CurrentPlaylist';


class App extends React.Component {
  state = {
    token: '',
    errorMessage: '',
    user: {
      name: '',
      id: '',
    },
    currentPlaylist: {
      id: '',
      isEditing: false,
    },
    userPlaylists: {
      items: [],
      nextPlaylistsEndpoint: null,
      needsRefresh: false,
    },
  }

  componentDidMount() {
    let token = getTokenFromURI();
    const authError = checkURIforError();
    if (!token && !authError) {
      token = getTokenFromLocal();
    }
    this.setError(authError);
    if (token) {
      this.setState({ token });
      this.getProfile(token);
    }
  }

  setError = (error) => {
    const errorMessage = error ? error.message : '';
    this.setState({ errorMessage });
  }

  getProfile = async (token) => {
    try {
      const userProfile = await fetchProfile(token);
      this.setError();
      this.setState({
        user: {
          name: userProfile.display_name,
          id: userProfile.id,
        },
      });
    } catch (error) {
      this.setError(error);
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
            needsRefresh: false,
          },
        };
      });
      this.setError();
    } catch (error) {
      this.setError(error);
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
      this.setError();
      this.setState({
        currentPlaylist: {
          isEditing: false,
          id: selectedPlaylist.id,
        },
      });
    }
  };

  toggleEditPlaylist = () => {
    this.setState(prevState => ({
      currentPlaylist: {
        ...prevState.currentPlaylist,
        isEditing: !prevState.currentPlaylist.isEditing,
      },
    }));
  }

  deletePlaylist = async () => {
    const { token, currentPlaylist: { id }, userPlaylists: { items } } = this.state;
    const updatedPlaylists = items.filter(item => item.id !== id);
    try {
      await unfollowPlaylist(token, id);
      this.setState(prevState => ({
        currentPlaylist: {
          id: '',
          isEditing: false,
        },
        userPlaylists: {
          ...prevState.userPlaylists,
          items: [...updatedPlaylists],
        },
      }));
      this.setError();
    } catch (error) {
      this.setError();
    }
  }

  updateUserPlaylists = (playlist) => {
    const playlistItems = [...this.state.userPlaylists.items];
    const targetIndex = playlistItems.findIndex(playlistItem => playlist.id === playlistItem.id);
    if (targetIndex === -1) {
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
    this.setError();
  }


  render() {
    const {
      user,
      token,
      currentPlaylist,
      userPlaylists,
      userPlaylists: { items },
      errorMessage,
    } = this.state;
    const playlist = items
      .find(playlistItem => (playlistItem.id === currentPlaylist.id));
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
              getUserPlaylists={this.getUserPlaylists}
              sortPlaylists={this.sortPlaylists}
            />
            )
          }
        </Sidebar>
        { currentPlaylist.id
          ? (
            <CurrentPlaylist
              key={currentPlaylist.id}
              token={token}
              userId={user.id}
              isEditing={currentPlaylist.isEditing}
              errorMessage={errorMessage}
              playlist={playlist}
              refreshPlaylists={this.refreshPlaylists}
              setCurrentPlaylist={this.setCurrentPlaylist}
              toggleEditPlaylist={this.toggleEditPlaylist}
              deletePlaylist={this.deletePlaylist}
              updateUserPlaylists={this.updateUserPlaylists}
              setError={this.setError}
            />
          )
          : <Dashboard errorMessage={errorMessage} />
        }


      </div>
    );
  }
}

export default hot(App);
