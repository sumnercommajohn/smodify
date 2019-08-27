import React from 'react';
import PlaylistItem from './PlaylistItem';
import { ErrorMessage } from './ErrorMessage';
import SortButton from './SortButton';


class UserPlaylists extends React.Component {
  componentDidMount() {
    const { token, getUserPlaylists, userPlaylists: { items } } = this.props;
    if (!items.length) {
      getUserPlaylists(token);
    }
  }

  componentDidUpdate(prevProps) {
    const {
      token,
      getUserPlaylists,
      userPlaylists: { nextPlaylistsEndpoint, needsRefresh },
    } = this.props;

    if (needsRefresh) {
      getUserPlaylists(token);
    }

    if (nextPlaylistsEndpoint
      && nextPlaylistsEndpoint !== prevProps.userPlaylists.nextPlaylistsEndpoint) {
      getUserPlaylists(token, nextPlaylistsEndpoint);
    }
  }


  render() {
    const {
      setCurrentPlaylist,
      sortPlaylists,
      userPlaylists: { items, isOpen },
      togglePlaylistMenu,
    } = this.props;

    return (
      <div className="sidebar-component">
        <h3 className="sidebar-title">Playlists</h3>
        <button onClick={togglePlaylistMenu} type="button" className="sidebar-toggle">{isOpen ? '︾' : ' ︽'}</button>
        <ul className={`user-playlists${isOpen ? ' open' : ''}`}>
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
                togglePlaylistMenu={togglePlaylistMenu}
              />
            ))
            : <p>Loading...</p>}
        </ul>
      </div>
    );
  }
}

export default UserPlaylists;
