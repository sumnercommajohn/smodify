import React from 'react';


class PlaylistTracks extends React.Component {
  render() {
    return (
      <div className="current-playlist-tracks">
        {this.props.children}
      </div>
    );
  }
}

export default PlaylistTracks;
