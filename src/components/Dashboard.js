import React from 'react';
import { Landing } from './Landing';
import { ErrorMessage } from './ErrorMessage';


export const Dashboard = ({ errorMessage }) => (
  <main className="dashboard">
    { errorMessage && <ErrorMessage message={errorMessage} /> }
    <Landing />
  </main>
);

export default Dashboard;
