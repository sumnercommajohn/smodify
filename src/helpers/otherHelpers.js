export function matchTracks(searchWord, items) {
  return items.filter((item) => {
    const regex = new RegExp(searchWord, 'gi');
    return item.track.name.match(regex)
    || item.track.album.name.match(regex)
    || item.track.artists[0].name.match(regex);
  });
}
