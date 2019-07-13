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


export const waitForServerPropagation = milliseconds => new Promise((resolve) => {
  setTimeout(resolve, milliseconds);
});


export const getTrackURIs = items => items.map((item => item.track.uri));

export async function postTracklistFragment(token, playlistId, trackURIs, offset, limit) {
  const currentFragment = trackURIs.slice(offset, offset + limit);

  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);

  const outcome = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify({
      uris: currentFragment,
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw Error(`Request rejected with status ${response.status}`);
    });

  return ({
    ...outcome,
    offset: offset + limit,
  });
}

export async function postAllTracks(token, playlistId, trackURIs, offset = 0, limit = 100) {
  const response = await postTracklistFragment(token, playlistId, trackURIs, offset, limit);
  if (response.offset <= trackURIs.length) {
    await postAllTracks(token, playlistId, trackURIs, response.offset, limit);
  }
}


export async function clonePlaylist(token, userId, playlist, tracks) {
  const trackURIs = getTrackURIs(tracks.items);
  const newPlaylist = await createNewPlaylist(token, userId, `${playlist.name} (Copy)`);

  await postAllTracks(token, newPlaylist.id, trackURIs);
  tracks.href = `https://api.spotify.com/v1/playlists/${newPlaylist.id}/tracks`;
  newPlaylist.images = [...playlist.images];

  return { ...newPlaylist, tracks };
}
