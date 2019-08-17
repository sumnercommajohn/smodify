import React from 'react';

class PlaylistItem extends React.PureComponent {
  render() {
    const { setCurrentPlaylist, playlist: { name, tracks }, playlist } = this.props;
    console.log('rendering a playlist!');
    return (
      <li>
        <button type="button" className="playlist-button" onClick={() => setCurrentPlaylist(playlist)}>
          <div className="user-playlist-item">
            <span className="playlist-title">{name}</span>
            <span className="tracks">{tracks.total} Songs</span>
          </div>
        </button>
      </li>
    );
  }
}

export default PlaylistItem;
