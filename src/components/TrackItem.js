import React from 'react';

export const TrackItem = (props) => {
  const {
    name, artists, album, id,
  } = props;

  return (
    <label htmlFor={id}>
      <li className="playlist-track">
        <input className="checkbox" type="checkbox" id={id} />
        <div className="song-details">
          <span className="song-title">{name}</span>
          <span className="song-artist">{artists[0].name}</span> • <span className="song-album">{album.name}</span>
        </div>
      </li>
    </label>
  );
};
