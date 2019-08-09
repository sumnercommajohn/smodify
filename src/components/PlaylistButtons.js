import React from 'react';

export const PlaylistButtons = ({
  duplicateCurrentPlaylist, isEditing, ownedByUser, toggleEditPlaylist,
}) => (
  <div className="current-playlist-buttons">
    <button type="button" className="action" onClick={duplicateCurrentPlaylist} disabled={isEditing}>
        Clone Playlist
    </button>
    { ownedByUser
    && (
    <button type="button" className="action" onClick={toggleEditPlaylist} disabled={isEditing}>
        Edit Playlist
    </button>
    )
    }
  </div>
);
