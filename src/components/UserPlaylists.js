import React from 'react';
import { Playlist } from './Playlist';

export const UserPlaylists = (props) => {
  const { playlists } = props;
  console.log(playlists.items);
  return (
    <ul>
      {playlists.items.length
        ? playlists.items.map(playlist => (<Playlist key={playlist.id} name={playlist.name} />))
        : <p>Loading...</p>}
    </ul>
  );
};
