export const getAuthQuery = (dialog = false) => {
  const authEndpoint = 'https://accounts.spotify.com/authorize';
  const clientId = '10a41ddfc787418f9ef272f0bf886e86';
  const redirectUri = 'http://localhost:8080/';
  const scopes = [
    'playlist-read-private',
    'playlist-modify-public',
    'playlist-modify-private',
  ];
  const responseType = 'token';
  const showDialog = dialog;

  const authQuery = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=${responseType}&show_dialog=${showDialog}`;
  return authQuery;
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

  return hash.access_token || null;
};

export const checkURIforError = () => {
  const query = window.location.search.substring(1);
  return query.includes('error');
};
