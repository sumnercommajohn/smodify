import React from 'react';

class TrackItem extends React.Component {
  state = {
    checked: false,
  }


  render() {
    const {
      name, artists, album, uid, toggleSelection,
    } = this.props;
    return (
      <label htmlFor={uid}>
        <li className="playlist-track">
          <input className="checkbox" type="checkbox" id={uid} onChange={e => toggleSelection(uid, e.target.checked)} />
          <div className="song-details">
            <span className="song-title">{name}</span>
            <span className="song-artist">{artists[0].name}</span> • <span className="song-album">{album.name}</span>
          </div>
        </li>
      </label>
    );
  }
}

export default TrackItem;
