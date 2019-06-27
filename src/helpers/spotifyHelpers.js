export async function createNewPlaylist(token, userId, playlistName) {
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);

  const outcome = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify({
      name: playlistName,
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw Error(`Request rejected with status ${response.status}`);
    });

  return outcome;
}

export const fetchCreateNewPlaylist = (token, userId, playlistName) => {
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);
  fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify({
      name: playlistName,
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw Error(`Request rejected with status ${response.status}`);
    });
};
