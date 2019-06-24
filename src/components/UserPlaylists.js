import React from 'react';
import { PlaylistItem } from './PlaylistItem';
import { ErrorMessage } from './ErrorMessage';
import SortButton from './SortButton';


class UserPlaylists extends React.Component {
  state = {
    items: [],
    nextPlaylistsEndpoint: null,
    error: false,
    errorMessage: '',
  }


  componentDidMount() {
    const { token } = this.props;
    if (!this.state.items.length) {
      this.fetchUserPlaylists(token);
    }
  }

  componentDidUpdate() {
    const { token } = this.props;
    const { nextPlaylistsEndpoint } = this.state;
    if (nextPlaylistsEndpoint) {
      this.fetchUserPlaylists(token, nextPlaylistsEndpoint);
    }
  }


  fetchUserPlaylists = (token, endpoint = 'https://api.spotify.com/v1/me/playlists', refresh = false) => {
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
          items: [...prevState.items, ...playlistsObject.items],
          nextPlaylistsEndpoint: playlistsObject.next,
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

  sortPlaylists = (sortBy, sortDescending = false) => {
    const { items } = this.state;
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
    this.setState({
      items: [...playlistsSorted],
    });
  };

  render() {
    const {
      errorMessage,
      setCurrentPlaylist,
    } = this.props;
    const { items } = this.state;
    return (
      <div className="sidebar-component">
        {errorMessage && <ErrorMessage message={errorMessage} />}
        <h3>Playlists</h3>
        <ul className="user-playlists">
          <div className="list-headers">
            <SortButton sortFunction={this.sortPlaylists} sortBy="name">Title</SortButton>
            <SortButton sortFunction={this.sortPlaylists} sortBy="total">Tracks</SortButton>
          </div>
          {items.length
            ? items.map(playlist => (
              <PlaylistItem
                key={playlist.id}
                playlist={playlist}
                setCurrentPlaylist={setCurrentPlaylist}
              />
            ))
            : <p>Loading...</p>}
        </ul>
      </div>
    );
  }
}

export default UserPlaylists;
