import React from 'react';

export const TrackItem = (props) => {
  const { name, artists, album } = props;
  return (
    <li className="playlist-track">
      <span>{props.id}</span>
    </li>
  );
};
