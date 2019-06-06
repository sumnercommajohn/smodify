import React from 'react';
import { getAuthURL } from '../config/authConfig';

export const LoginLink = (props) => {
  const { message, dialog } = props;
  return (<a href={getAuthURL(dialog)}>{message}</a>);
};
