import React from 'react';

export const PlaylistItem = (props) => {
  console.log(props.playlist);
  const { name, tracks, owner } = props.playlist;
  console.log(name, tracks, owner);
  return (
    <li className="playlist-item">
      <span className="playlist-title">{name}</span>
      <span className="owner">Created by {owner.display_name}</span>
      <span className="tracks">{tracks.total} Songs</span>
    </li>
  );
};
