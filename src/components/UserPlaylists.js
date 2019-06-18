import React from 'react';
import { PlaylistItem } from './PlaylistItem';
import { ErrorMessage } from './ErrorMessage';
import SortButton from './SortButton';


class UserPlaylists extends React.Component {
  componentDidMount() {
    const { token, fetchUserPlaylists } = this.props;
    console.log('fetching Playlists...');
    fetchUserPlaylists(token);
  }

  componentDidUpdate() {
    const { fetchUserPlaylists, token, playlists: { nextPlaylistsEndpoint } } = this.props;
    if (nextPlaylistsEndpoint) {
      console.log('fetching more playlists...');
      fetchUserPlaylists(token, nextPlaylistsEndpoint);
    }
  }

  componentWillUnmount() {
    console.log('UserPlaylists unmounting!');
  }

  render() {
    console.log('UserPlaylists render');
    const {
      playlists,
      errorMessage,
      sortPlaylists,
      setCurrentPlaylist,
    } = this.props;
    return (
      <div className="sidebar-component">
        {errorMessage && <ErrorMessage message={errorMessage} />}
        <h3>Playlists</h3>
        <ul className="user-playlists">
          <div className="list-headers">
            <SortButton sortFunction={sortPlaylists} sortBy="name">Title</SortButton>
            <SortButton sortFunction={sortPlaylists} sortBy="total">Tracks</SortButton>
          </div>
          {playlists.items.length
            ? playlists.items.map(playlist => (
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
