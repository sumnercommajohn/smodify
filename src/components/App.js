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
import SelectPlaylist from './SelectPlaylist';


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
      isSelectPlaylistOpen: false,
    },
    userPlaylists: {
      isOpen: true,
      items: {},
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

  toggleSelectPlaylist = () => {
    this.setState(prevState => ({
      currentPlaylist: {
        ...prevState.currentPlaylist,
        isSelectPlaylistOpen: !prevState.currentPlaylist.isSelectPlaylistOpen,
      },
    }));
  }

  getUserPlaylists = async (token, endpoint = 'https://api.spotify.com/v1/me/playlists') => {
    try {
      const playlistsObject = await fetchSomePlaylists(token, endpoint);
      const items = arrayToObject(playlistsObject.items, 'id');
      this.setState(prevState => ({
        userPlaylists: {
          items: { ...prevState.userPlaylists.items, ...items },
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
        const updatedPlaylists = { ...prevState.userPlaylists.items };
        delete updatedPlaylists[id];
        return ({
          currentPlaylist: {
            id: '',
            isEditing: false,
          },
          userPlaylists: {
            ...prevState.userPlaylists,
            items: { ...updatedPlaylists },
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
      const playlistItems = { ...prevState.userPlaylists.items };
      playlistItems[playlist.id] = playlist;
      return ({
        userPlaylists: {
          ...prevState.userPlaylists,
          items: { ...playlistItems },
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
      userPlaylists: { items, isOpen },
      errorMessage,
    } = this.state;
    const playlist = items[currentPlaylist.id];
    return (
      <div className="app">
        <Sidebar>
          { user.name
            ? <Welcome name={user.name} isOpen={isOpen} />
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
              isSelectPlaylistOpen={currentPlaylist.isSelectPlaylistOpen}
              errorMessage={errorMessage}
              playlist={playlist}
              refreshPlaylists={this.refreshPlaylists}
              setCurrentPlaylist={this.setCurrentPlaylist}
              toggleEditPlaylist={this.toggleEditPlaylist}
              toggleSelectPlaylist={this.toggleSelectPlaylist}
              deletePlaylist={this.deletePlaylist}
              updateUserPlaylists={this.updateUserPlaylists}
              setError={this.setError}
              SelectPlaylistComponent={(
                <SelectPlaylist
                  items={userPlaylists.items}
                  userId={user.id}
                  toggleSelectPlaylist={this.toggleSelectPlaylist}
                />
)}
            />
          )
          : <Dashboard errorMessage={errorMessage} />
        }


      </div>
    );
  }
}

export default hot(App);
