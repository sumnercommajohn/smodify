import React from 'react';

class TrackItem extends React.PureComponent {
  state = {
    checked: false,
  }

  handleChange = (e) => {
    const { uid, toggleSelection } = this.props;
    this.setState({ checked: e.target.checked });
    toggleSelection(uid, e.target.checked);
  }

  render() {
    console.log('rendering!');
    const {
      name, artists, album, uid,
    } = this.props;
    const { checked } = this.state;
    return (
      <label htmlFor={uid}>
        <li className={`playlist-track-row${checked ? ' checked' : ''}`}>
          <input className="checkbox" type="checkbox" id={uid} onChange={this.handleChange} />
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
