import React from 'react';
import { PlaylistItem } from './PlaylistItem';

export const UserPlaylists = (props) => {
  const { playlists } = props;
  console.log(playlists.items);
  return (
    <div className="sidebar-component">
      <h3>Playlists</h3>
      <ul className="user-playlists">
        {playlists.items.length
          ? playlists.items.map(playlist => (
            <PlaylistItem
              key={playlist.id}
              playlist={playlist}
            />
          ))
          : <p>Loading...</p>}
      </ul>
    </div>
  );
};
