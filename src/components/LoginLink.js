import React from 'react';
import { getAuthURL } from '../config/authConfig';


export const LoginLink = ({ message, dialog }) => (<a href={getAuthURL(dialog)}>{message}</a>);
