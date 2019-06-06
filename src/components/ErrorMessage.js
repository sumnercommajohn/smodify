import React from 'react';

export const ErrorMessage = props => (
  <div className="warning">
    <p>
    Something weird happened:
    </p>
    <p className="text-bold">
      {props.message}.
    </p>
    <p>
    You should try again.
    </p>
  </div>
);
