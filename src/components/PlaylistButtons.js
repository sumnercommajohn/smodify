import React from 'react';

export const PlaylistButtons = (props) => {
  const { duplicateCurrentPlaylist, edit } = props;
  return (
    <div className="current-playlist-buttons">
      <button type="button" className="copy-button" onClick={duplicateCurrentPlaylist}>
              Clone Playlist
      </button>
      <button type="button" className="action" disabled={edit}>
                Edit Playlist
      </button>
    </div>

  );
};
