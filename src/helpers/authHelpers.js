export const getAuthURL = ({ clientId, redirectUri }, showDialog = false) => {
  const authEndpoint = 'https://accounts.spotify.com/authorize';
  const responseType = 'token';
  const scopes = [
    'playlist-read-private',
    'playlist-modify-public',
    'playlist-modify-private',
  ];
  const authURL = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=${responseType}&show_dialog=${showDialog}`;
  return authURL;
};

export const saveTokenToLocal = (token) => {
  const timeStamp = Date.now();
  localStorage.setItem(
    'oldToken',
    JSON.stringify({ token, timeStamp }),
  );
};

export const getTokenFromURI = () => {
  const hash = window.location.hash
    .substring(1)
    .split('&')
    .reduce((initial, item) => {
      if (item) {
        const parts = item.split('=');
        initial[parts[0]] = decodeURIComponent(parts[1]);
      }
      return initial;
    }, {});
  window.location.hash = '';
  if (hash.access_token) { saveTokenToLocal(hash.access_token); }
  return hash.access_token || '';
};


export const getTokenFromLocal = () => {
  const oldToken = JSON.parse(localStorage.getItem('oldToken'));
  if (oldToken && Date.now() - oldToken.timeStamp < 3599000) {
    return oldToken.token;
  }
  return false;
};

export const checkURIforError = () => {
  const query = window.location.search.substring(1);
  if (query.includes('error')) {
    return ({ message: 'Spotify profile not connected' });
  }
  return false;
};
