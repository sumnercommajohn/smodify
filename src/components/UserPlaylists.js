import React from 'react';
import PlaylistItem from './PlaylistItem';
import { ErrorMessage } from './ErrorMessage';
import SortButton from './SortButton';


class UserPlaylists extends React.Component {
  state = {
    sortBy: '',
    sortDescending: true,
  }


  componentDidMount() {
    const { token, getUserPlaylists } = this.props;
    getUserPlaylists(token);
  }

  componentDidUpdate(prevProps) {
    const {
      token,
      getUserPlaylists,
      userPlaylists: { nextPlaylistsEndpoint, needsRefresh },
    } = this.props;

    if (!prevProps.needsRefresh && needsRefresh) {
      getUserPlaylists(token);
    }

    if (nextPlaylistsEndpoint
      && nextPlaylistsEndpoint !== prevProps.userPlaylists.nextPlaylistsEndpoint) {
      getUserPlaylists(token, nextPlaylistsEndpoint);
    }
  }

  setSort = (sortBy, sortDescending) => {
    this.setState({ sortBy, sortDescending });
  }


  convertToSortedArray = (itemsObject) => {
    const { sortBy, sortDescending } = this.state;
    const playlistsArray = Object.values(itemsObject);
    if (!sortBy) { return playlistsArray; }
    const playlistsMap = playlistsArray.map(playlist => ({
      id: playlist.id,
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
    const playlistsArraySorted = playlistsMap.map(mapItem => itemsObject[mapItem.id]);
    return playlistsArraySorted;
  };

  render() {
    const {
      setCurrentPlaylist,
      userPlaylists: { items, isOpen },
      togglePlaylistMenu,
    } = this.props;
    const playlistItems = this.convertToSortedArray(items);

    return (
      <div className="sidebar-component">
        <h3 className="sidebar-title">Playlists<button onClick={togglePlaylistMenu} type="button" className="sidebar-toggle">{isOpen ? '︽' : '︾'}</button></h3>

        <ul className={`user-playlists${isOpen ? ' open' : ''}`}>
          <div className="list-headers">
            <SortButton sortFunction={this.setSort} sortBy="name">Title</SortButton>
            <SortButton sortFunction={this.setSort} sortBy="total">Tracks</SortButton>
          </div>
          {playlistItems.length >= 1
            ? playlistItems.map(playlist => (
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
