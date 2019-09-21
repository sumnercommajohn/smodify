import React from 'react';
import SelectPlaylistItem from './SelectPlaylistItem';

class SelectPlaylist extends React.Component {
  state= {
    newPlaylistIsChecked: false,
    checkedPlaylistIds: [],
  }

  toggleChecked = (id) => {
    this.setState((prevState) => {
      const checkedPlaylistIds = [...prevState.checkedPlaylistIds];
      const index = checkedPlaylistIds.indexOf(id);
      if (index === -1) {
        return ({ checkedPlaylistIds: [...checkedPlaylistIds, id] });
      }
      return ({
        checkedPlaylistIds: checkedPlaylistIds.filter(item => item !== id),
      });
    });
  }

  render() {
    const {
      items, userId, toggleSelectPlaylist,
    } = this.props;
    const filteredItems = Object.values(items).filter(item => userId === item.owner.id);
    return (
      <div className="select-playlist">
        <div className="select-playlist-header playlist-track-row">
          Select playlists to add tracks to:
        </div>
        <ul>
          <li className="playlist-track-row">
            <label className="checkbox-label" htmlFor="new-playlist">
              <input className="checkbox" type="checkbox" id="new-playlist" />
            </label>
            <div className="song-details">
              <span className="song-title">+ New Playlist...</span>
            </div>
          </li>
          { filteredItems
        && filteredItems.map(playlist => (
          <SelectPlaylistItem
            toggleChecked={this.toggleChecked}
            key={playlist.id}
            playlist={playlist}
          />
        ))}
        </ul>
        <div className="select-playlist-footer playlist-track-row song-details song-title">
          <button type="button" className="action">Add Songs</button>
          <button type="button" className="danger" onClick={toggleSelectPlaylist}>Cancel</button>
        </div>
      </div>
    );
  }
}

export default SelectPlaylist;
