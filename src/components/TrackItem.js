import React from 'react';

export const TrackItem = (props) => {
  const { name, artists, album } = props;

  return (
    <li className="playlist-track">
      <span role="img" aria-label="dummy-checkbox" className="checkbox">🔘</span>
      <div className="song-details">
        <span className="song-title">{name}</span>
        <span className="song-artist">{artists[0].name}</span> • <span className="song-album">{album.name}</span>
      </div>
    </li>
  );
};
