import React from 'react';
import { getAuthURL } from '../helpers/authHelpers';
import { config } from '../config/auth.config';


export const LoginLink = ({ message, dialog }) => (
  <a href={getAuthURL(config, dialog)}>{message}</a>
);
