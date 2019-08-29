import React from 'react';

class TrackItem extends React.PureComponent {
  handleChange = (e) => {
    const { uid, toggleChecked } = this.props;
    toggleChecked(uid, e.target.checked);
  }

  render() {
    const {
      name, artists, album, uid, isChecked, ownedByUser,
    } = this.props;
    const itemClass = `playlist-track-row${isChecked ? ' checked' : ''}`;

    return (
      <li className={itemClass}>
        <label className="checkbox-label" htmlFor={uid}>
          <input className="checkbox" type="checkbox" disabled={!ownedByUser} id={uid} onChange={this.handleChange} checked={isChecked} />
        </label>
        <div className="song-details">
          <span className="song-title">{name}</span>
          <span className="song-artist">{artists[0].name}</span> • <span className="song-album">{album.name}</span>
        </div>
      </li>
    );
  }
}

export default TrackItem;
