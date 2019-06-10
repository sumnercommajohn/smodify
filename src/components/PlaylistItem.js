import React from 'react';

export const PlaylistItem = (props) => {
  console.log(props.playlist);
  const { name, tracks } = props.playlist;
  console.log(name, tracks);
  return (
    <li className="playlist-item">
      <span className="playlist-title">{name}</span>
      <span className="tracks">{tracks.total} Songs</span>
    </li>
  );
};
