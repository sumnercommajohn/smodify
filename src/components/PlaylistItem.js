import React from 'react';

export const PlaylistItem = (props) => {
  const { name, tracks } = props.playlist;
  return (
    <li className="playlist-item">
      <span className="playlist-title">{name}</span>
      <span className="tracks">{tracks.total} Songs</span>
    </li>
  );
};
