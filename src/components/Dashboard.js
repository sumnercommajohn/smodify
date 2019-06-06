import React from 'react';
import { UserPlaylists } from './UserPlaylists';
import { Landing } from './Landing';
import { ErrorMessage } from './ErrorMessage';


export const Dashboard = (props) => {
  const { playlists, errorMessage } = props;
  return (
    <main className="dashboard">
      { errorMessage && <ErrorMessage message={errorMessage} /> }
      {playlists ? <UserPlaylists playlists={playlists} />
        : <Landing errorMessage={errorMessage} />}
    </main>
  );
};

export default Dashboard;
