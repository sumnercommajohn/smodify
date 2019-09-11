import React from 'react';
import { hot } from 'react-hot-loader/root';
import { fetchProfile, fetchSomePlaylists, unfollowPlaylist } from '../helpers/spotifyAPIhelpers';
import { checkURIforError, getTokenFromURI, getTokenFromLocal } from '../helpers/authHelpers';
import { arrayToObject } from '../helpers/otherHelpers';
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
      isOpen: true,
      itemsObject: {},
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

  togglePlaylistMenu = () => {
    this.setState(prevState => ({
      userPlaylists: {
        ...prevState.userPlaylists,
        isOpen: !prevState.userPlaylists.isOpen,
      },
    }));
  }


  getUserPlaylists = async (token, endpoint = 'https://api.spotify.com/v1/me/playlists') => {
    try {
      const playlistsObject = await fetchSomePlaylists(token, endpoint);
      const itemsObject = arrayToObject(playlistsObject.items, 'id');
      this.setState(prevState => ({
        userPlaylists: {
          itemsObject: { ...prevState.userPlaylists.itemsObject, ...itemsObject },
          nextPlaylistsEndpoint: playlistsObject.next,
          needsRefresh: false,
          isOpen: prevState.userPlaylists.isOpen,
        },
      }));
      this.setError();
    } catch (error) {
      this.setError(error);
    }
  }

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
    const { token, currentPlaylist: { id } } = this.state;
    try {
      await unfollowPlaylist(token, id);
      this.setState((prevState) => {
        const updatedPlaylists = { ...prevState.userPlaylists.itemsObject };
        delete updatedPlaylists[id];
        return ({
          currentPlaylist: {
            id: '',
            isEditing: false,
          },
          userPlaylists: {
            ...prevState.userPlaylists,
            itemsObject: { ...updatedPlaylists },
          },
        });
      });
      this.setError();
    } catch (error) {
      this.setError();
    }
  }

  updateUserPlaylists = (playlist) => {
    this.setState((prevState) => {
      const playlistItems = { ...prevState.userPlaylists.itemsObject };
      playlistItems[playlist.id] = playlist;
      return ({
        userPlaylists: {
          ...prevState.userPlaylists,
          itemsObject: { ...playlistItems },
        },
      });
    });
    this.setError();
  }


  render() {
    const {
      user,
      token,
      currentPlaylist,
      userPlaylists,
      userPlaylists: { itemsObject },
      errorMessage,
    } = this.state;
    const playlist = itemsObject[currentPlaylist.id];
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
              togglePlaylistMenu={this.togglePlaylistMenu}
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
