const authEndpoint = 'https://accounts.spotify.com/authorize';

// Replace with your app's client ID, redirect URI and desired scopes
const clientId = '10a41ddfc787418f9ef272f0bf886e86';
const redirectUri = 'http://localhost:8080/';
const scopes = [
  'user-read-email',
  'user-read-private',
  'user-read-birthdate',
];
const responseType = 'token';
export const authQuery = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=${responseType}`;

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

  return hash.access_token || null;
};
