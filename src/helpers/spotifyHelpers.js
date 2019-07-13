export async function fetchProfile(token) {
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);

  const outcome = await fetch('https://api.spotify.com/v1/me', {
    method: 'GET',
    headers: myHeaders,
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw Error(`Request rejected with status ${response.status}`);
    });

  return outcome;
}

export async function fetchSomePlaylists(token, endpoint = 'https://api.spotify.com/v1/me/playlists') {
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);

  const outcome = await fetch(endpoint, {
    method: 'GET',
    headers: myHeaders,
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw Error(`Request rejected with status ${response.status}`);
    });

  return outcome;
}

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
  newPlaylist.images = [...playlist.images];
  tracks.href = `https://api.spotify.com/v1/playlists/${newPlaylist.id}/tracks`;
  if (trackURIs.length) {
    await postAllTracks(token, newPlaylist.id, trackURIs);
  }

  return { ...newPlaylist, tracks };
}

export async function fetchSomeTracks(token, endpoint) {
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);
  const fields = '?fields=next,total,limit,items(track(album(name),artists(name),id,name,uri))';
  // Checking for fields because when you specify fields in your query parameters,
  // Spotify's API will include them in any paging objects returned in the response
  if (!endpoint.includes('?')) {
    endpoint += fields;
  }
  const outcome = await fetch(endpoint, {
    method: 'GET',
    headers: myHeaders,
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw Error(`Request rejected with status ${response.status}`);
    });

  return outcome;
}
