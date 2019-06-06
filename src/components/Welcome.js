import React from 'react';
import { LoginLink } from './LoginLink';

export const Welcome = (props) => {
  const [firstName] = props.user.split(' ');
  return (
    <div>
      <h3>Welcome, {firstName}
        <span className="text-small"><LoginLink dialog message=" (Not You?)" /></span>
      </h3>

    </div>
  );
};
