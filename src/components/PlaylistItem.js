import React from 'react';

export const PlaylistItem = (props) => {
  const { setCurrentPlaylist, playlist: { name, tracks } } = props;
  return (
    <li>
      <button type="button" className="playlist-button" onClick={() => setCurrentPlaylist(props.playlist)}>
        <div className="playlist-item">
          <span className="playlist-title">{name}</span>
          <span className="tracks">{tracks.total} Songs</span>
        </div>
      </button>
    </li>

  );
};
