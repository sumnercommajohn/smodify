import React from 'react';


export const PlaylistDetails = ({
  playlist: {
    name, owner: { display_name: ownerName }, tracks: { total },
  },
}) => (
  <div className="current-playlist-details">
    <h3 className="current-playlist-title"> {name} </h3>
    <h4>By {ownerName} - {total} tracks </h4>
  </div>
);
