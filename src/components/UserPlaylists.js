import React from 'react';
import { PlaylistItem } from './PlaylistItem';
import { ErrorMessage } from './ErrorMessage';
import SortButton from './SortButton';


export const UserPlaylists = (props) => {
  const {
    playlists, errorMessage, sortPlaylists, setCurrentPlaylist,
  } = props;
  return (
    <div className="sidebar-component">
      {errorMessage && <ErrorMessage message={errorMessage} />}
      <h3>Playlists</h3>
      <ul className="user-playlists">
        <div className="list-headers">
          <SortButton sortFunction={sortPlaylists} sortBy="name">Title</SortButton>
          <SortButton sortFunction={sortPlaylists} sortBy="total">Tracks</SortButton>
        </div>
        {playlists.length
          ? playlists.map(playlist => (
            <PlaylistItem
              key={playlist.id}
              playlist={playlist}
              setCurrentPlaylist={setCurrentPlaylist}
            />
          ))
          : <p>Loading...</p>}
      </ul>
    </div>
  );
};
