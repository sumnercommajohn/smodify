import React from 'react';
import macaroon from '../assets/img/Macaroonicon.svg';

export const Landing = () => (
  <div className="logo">
    <img src={macaroon} alt="" />
    <h1 className="title">Smodify.</h1>
    <p className="logo-tagline">Playlist Tools for Spotify</p>
  </div>
);
