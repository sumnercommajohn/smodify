import React from 'react';

export const PlaylistButtons = ({
  duplicateCurrentPlaylist, edit, ownedByUser, toggleEditPlaylist,
}) => (
  <div className="current-playlist-buttons">
    <button type="button" className="action" onClick={duplicateCurrentPlaylist} disabled={edit}>
        Clone Playlist
    </button>
    { ownedByUser
    && (
    <button type="button" className="action" onClick={toggleEditPlaylist} disabled={edit}>
        Edit Playlist
    </button>
    )
    }
  </div>
);
