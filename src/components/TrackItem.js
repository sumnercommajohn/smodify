import React from 'react';

class TrackItem extends React.PureComponent {
  handleChange = (e) => {
    const { uid, toggleSelection, toggleChecked } = this.props;
    // this.setState({ checked: e.target.checked });
    toggleChecked(uid, e.target.checked);
    // toggleSelection(uid, e.target.checked);
  }

  render() {
    console.log('rendering!');
    const {
      name, artists, album, uid, isChecked,
    } = this.props;
    const itemClass = `playlist-track-row${isChecked ? ' checked' : ''}`;
    return (
      <label htmlFor={uid}>
        <li className={itemClass}>
          <input className="checkbox" type="checkbox" id={uid} onChange={this.handleChange} checked={isChecked} />
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
