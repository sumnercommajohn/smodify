import React from 'react';

export const PlaylistButtons = ({
  duplicateCurrentPlaylist, editing, ownedByUser, toggleEditPlaylist,
}) => (
  <div className="current-playlist-buttons">
    <button type="button" className="action" onClick={duplicateCurrentPlaylist} disabled={editing}>
        Clone Playlist
    </button>
    { ownedByUser
    && (
    <button type="button" className="action" onClick={toggleEditPlaylist} disabled={editing}>
        Edit Playlist
    </button>
    )
    }
  </div>
);
