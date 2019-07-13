import React from 'react';
import { PlaylistItem } from './PlaylistItem';
import { ErrorMessage } from './ErrorMessage';
import SortButton from './SortButton';


class UserPlaylists extends React.Component {
  componentDidMount() {
    const { token, fetchUserPlaylists, userPlaylists: { items } } = this.props;
    if (!items.length) {
      fetchUserPlaylists(token);
    }
  }

  componentDidUpdate(prevProps) {
    const {
      token,
      fetchUserPlaylists,
      userPlaylists: { nextPlaylistsEndpoint, needsRefresh },
    } = this.props;

    if (needsRefresh) {
      fetchUserPlaylists(token);
    }

    if (nextPlaylistsEndpoint
      && nextPlaylistsEndpoint !== prevProps.userPlaylists.nextPlaylistsEndpoint) {
      fetchUserPlaylists(token, nextPlaylistsEndpoint);
    }
  }


  render() {
    const {
      errorMessage,
      setCurrentPlaylist,
      sortPlaylists,
      userPlaylists: { items },
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
