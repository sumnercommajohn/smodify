import React from 'react';
import { Landing } from './Landing';
import { ErrorMessage } from './ErrorMessage';


export const Dashboard = (props) => {
  const { errorMessage } = props;
  return (
    <main className="dashboard">
      { errorMessage && <ErrorMessage message={errorMessage} /> }
      <Landing />
    </main>
  );
};

export default Dashboard;
