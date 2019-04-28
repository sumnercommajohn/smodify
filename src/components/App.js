import React from 'react';
import { hot } from 'react-hot-loader/root';
import macaroon from '../assets/img/Macaroonicon.png';

function App() {
  return (
    <div className="app">
      <h1 className="title">Shmotify.</h1>
      <img src={macaroon} alt="" />
    </div>
  );
}

export default hot(App);
