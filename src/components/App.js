import React from 'react';
import { hot } from 'react-hot-loader/root';
import macaroon from '../assets/img/Macaroonicon.png';

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <h1 className="title">Shmotify</h1>
        <img src={macaroon} alt="" />
      </div>
    );
  }
}

export default hot(App);
