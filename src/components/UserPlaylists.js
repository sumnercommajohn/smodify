import React from 'react';
import { PlaylistItem } from './PlaylistItem';
import { ErrorMessage } from './ErrorMessage';

export const UserPlaylists = (props) => {
  const { playlists, errorMessage } = props;
  return (
    <div className="sidebar-component">
      {errorMessage && <ErrorMessage message={errorMessage} />}
      <h3>Playlists</h3>
      <ul className="user-playlists">
        {playlists.length
          ? playlists.map(playlist => (
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
