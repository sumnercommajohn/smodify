import React from 'react';

export const PlaylistHeader = ({ imageSrc, children }) => (
  <section className="current-playlist-header">
    <div className="playlist-header">
      <img className="current-playlist-image" src={imageSrc} alt="album artwork" />
      {children}
    </div>
  </section>

);

export default PlaylistHeader;
