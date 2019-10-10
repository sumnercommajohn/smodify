import React from 'react';
import SelectPlaylistItem from './SelectPlaylistItem';

class SelectPlaylist extends React.Component {
  state= {
    addToNewPlaylist: false,
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

  toggleAddToNewPlaylist = () => {
    this.setState(prevState => ({
      addToNewPlaylist: !prevState.addToNewPlaylist,
    }));
  }

  handleSubmit = (e) => {
    const { trackItems, addTracksToOtherPlaylists, toggleSelectPlaylist } = this.props;
    const { addToNewPlaylist, checkedPlaylistIds } = this.state;
    const tracksToAdd = trackItems.filter(item => item.isChecked);
    addTracksToOtherPlaylists(checkedPlaylistIds, tracksToAdd, addToNewPlaylist);
    e.preventDefault();
    toggleSelectPlaylist();
  }

  render() {
    const {
      userPlaylistItems, userId, toggleSelectPlaylist,
    } = this.props;
    const filteredItems = Object.values(userPlaylistItems).filter(item => userId === item.owner.id);
    return (
      <div className="select-playlist">
        <div className="select-playlist-header playlist-track-row">
          Select playlists to add tracks to:
        </div>
        <ul className="select-playlist-list">
          <li className="playlist-track-row">
            <label className="checkbox-label" htmlFor="new-playlist">
              <input className="checkbox" type="checkbox" id="new-playlist" onChange={this.toggleAddToNewPlaylist} />
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
          <button type="submit" className="action" onClick={this.handleSubmit}>Add Songs</button>
          <button type="button" className="danger" onClick={toggleSelectPlaylist}>Cancel</button>
        </div>
      </div>
    );
  }
}

export default SelectPlaylist;
