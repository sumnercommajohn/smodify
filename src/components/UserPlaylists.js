import React from 'react';
import { PlaylistItem } from './PlaylistItem';

export const UserPlaylists = (props) => {
  const { playlists } = props;
  console.log(playlists.items);
  return (
    <ul className="user-playlists">
      {playlists.items.length
        ? playlists.items.map(playlist => (<PlaylistItem key={playlist.id} playlist={playlist} />))
        : <p>Loading...</p>}
    </ul>
  );
};
