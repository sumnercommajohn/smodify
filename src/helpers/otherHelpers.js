export function matchTracks(searchString, items) {
  console.log('matching tracks!');
  return items.filter((item) => {
    const regex = new RegExp(searchString, 'gi');
    return item.track.name.match(regex)
    || item.track.album.name.match(regex)
    || item.track.artists[0].name.match(regex);
  });
}

export function arrayToObject(array, keyField) {
  return array.reduce((obj, item) => {
    obj[item[keyField]] = item;
    return obj;
  }, {});
}
