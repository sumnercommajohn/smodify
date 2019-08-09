import React from 'react';

export const PlaylistButtons = ({
  duplicateCurrentPlaylist, isEditing, ownedByUser, toggleEditPlaylist, deletePlaylist,
}) => (
  <div className="current-playlist-buttons">
    <button type="button" className="action" onClick={duplicateCurrentPlaylist} disabled={isEditing}>
        Clone
    </button>
    { ownedByUser
    && (
    <button type="button" className="action" onClick={toggleEditPlaylist} disabled={isEditing}>
        Edit
    </button>
    )
    }
    <button type="button" className="danger" onClick={deletePlaylist} disabled={isEditing}>
      {ownedByUser ? 'Delete' : 'Unfollow'}
    </button>
  </div>
);
