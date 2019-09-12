import React from 'react';
import { LoginLink } from './LoginLink';

export const Welcome = ({ name, isOpen }) => {
  const [firstName] = name.split(' ');
  const toggleClass = isOpen ? ' open' : '';
  return (
    <div className={`sidebar-component welcome${toggleClass}`}>
      <h3>Welcome, {firstName}
        <span className="text-small"><LoginLink dialog message=" (Not You?)" /></span>
      </h3>
    </div>
  );
};
