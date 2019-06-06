import React from 'react';
import macaroon from '../assets/img/Macaroonicon.png';

export const Landing = () => (
  <div className="logo">
    <img src={macaroon} alt="" />
    <h1 className="title">Smodify.</h1>
    <p className="logo-tagline">Playlist Modification Suite</p>
  </div>
);
