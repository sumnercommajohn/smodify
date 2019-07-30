import React from 'react';


export const CurrentPlaylistDetails = ({
  draftPlaylist: {
    name, owner: { display_name: ownerName }, tracks: { total },
  },
}) => (
  <div className="current-playlist-details">
    <h3 className="current-playlist-title"> {name} </h3>
    <h4>By {ownerName}</h4>
    <span>{total} tracks</span>
  </div>
);
