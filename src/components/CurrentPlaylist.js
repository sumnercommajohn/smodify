import React from 'react';
import { TrackItem } from './TrackItem';

class CurrentPlaylist extends React.Component {
  componentDidMount() {
    console.log(`Mounting ${this.props.playlist.name}`);
  }

  componentDidUpdate() {
    const { token, playlist } = this.props;

    if (playlist.tracks.next) {
      console.log('fetching next batch....');
      this.props.fetchCurrentPlaylistTracks(token, playlist.tracks.next);
    }
  }

  componentWillUnmount() {
    console.log(`Unmounting ${this.props.playlist.name}`);
  }

  render() {
    const { name, tracks: { items } } = this.props.playlist;
    console.log(`${name} render`);
    return (
      <main>
        <h3 className="title"> {name} </h3>

        <ul className="single-playlist">
          {items
              && items.map(trackItem => (
                <TrackItem
                  key={trackItem.track.id + trackItem.added_at}
                  id={trackItem.track.id + trackItem.added_at}
                  album={trackItem.track.album}
                  artists={trackItem.track.artists}
                  name={trackItem.track.name}
                />
              ))}
        </ul>

      </main>
    );
  }
}

export default CurrentPlaylist;
