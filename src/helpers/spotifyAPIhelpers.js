// -------------------------------------Profile Helpers
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

// -------------------------------------Playlist Fetchers
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

export async function fetchSinglePlaylist(token, playlistId) {
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);
  const endpoint = `https://api.spotify.com/v1/playlists/${playlistId}`;
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

export async function fetchPlaylistImage(token, playlistId) {
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);
  const endpoint = `https://api.spotify.com/v1/playlists/${playlistId}/images`;
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


// -------------------------------------Playlist Actions
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

export async function changePlaylistDetails(token, playlist) {
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);

  await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}`, {
    method: 'PUT',
    headers: myHeaders,
    body: JSON.stringify({
      name: playlist.name,
      public: playlist.public,
    }),
  })
    .then((response) => {
      console.log(response);
      if (response.ok) {
        return;
      }
      throw Error(`Request rejected with status ${response.status}`);
    });
}

export async function unfollowPlaylist(token, id) {
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);

  await fetch(`https://api.spotify.com/v1/playlists/${id}/followers`, {
    method: 'DELETE',
    headers: myHeaders,
  })
    .then((response) => {
      console.log(response);
      if (response.ok) {
        return;
      }
      throw Error(`Request rejected with status ${response.status}`);
    });
}

// -------------------------------------Track Fetchers

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


// -------------------------------------Tracklist Actions


export function getTracklistURIs(items) {
  return items.map((item => item.track.uri));
}

async function postTracklistFragment(token, playlistId, trackURIs, offset, limit) {
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
  if (response.offset < trackURIs.length) {
    await postAllTracks(token, playlistId, trackURIs, response.offset, limit);
  }
  return response;
}

export async function clonePlaylist(token, userId, playlist, tracks) {
  const trackURIs = getTracklistURIs(tracks.items);
  const newPlaylist = await createNewPlaylist(token, userId, `${playlist.name} (Copy)`);
  newPlaylist.images = [...playlist.images];
  tracks.href = `https://api.spotify.com/v1/playlists/${newPlaylist.id}/tracks`;
  if (trackURIs.length > 0) {
    await postAllTracks(token, newPlaylist.id, trackURIs);
  }

  return { ...newPlaylist, tracks };
}

function formatTracklistForDelete(items) {
  return items.map(item => ({ uri: item.track.uri }));
}

async function deleteTracklistFragment(
  token, playlistId, trackURIs,
  snapshotId, offset, limit,
) {
  const currentFragment = trackURIs.slice(offset, offset + limit);

  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);
  myHeaders.append('Content-Type', 'application/json');


  const outcome = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: 'DELETE',
    headers: myHeaders,
    body: JSON.stringify({
      tracks: currentFragment,
      snapshot_id: snapshotId,
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

export async function deleteAllTracks(
  token, playlistId, trackURIs,
  snapshotId, offset = 0, limit = 100,
) {
  const response = await deleteTracklistFragment(
    token, playlistId, trackURIs, snapshotId, offset, limit,
  );
  if (response.offset < trackURIs.length) {
    await deleteAllTracks(
      token, playlistId, trackURIs,
      response.snapshotId, response.offset, limit,
    );
  }
  return response;
}

export async function removeSelectedTracks(token, playlist, trackItems) {
  const trackURIs = formatTracklistForDelete(trackItems);

  if (trackURIs.length > 0) {
    const finalSnapshotId = await deleteAllTracks(token, playlist.id, trackURIs);
    return finalSnapshotId;
  }

  return ({ playlist });
}
