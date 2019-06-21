import React from 'react';
import { TrackItem } from './TrackItem';
import { ErrorMessage } from './ErrorMessage';

class CurrentPlaylist extends React.Component {
  state = {
    error: false,
    errorMessage: '',
    tracks: {
      items: [],
    },
    nextTracksEndpoint: null,
  }

  componentDidMount() {
    const { token, playlist } = this.props;
    this.fetchCurrentPlaylistTracks(token, playlist.tracks.href);
  }

  componentDidUpdate() {
    const { token } = this.props;
    const { nextTracksEndpoint } = this.state;

    if (nextTracksEndpoint) {
      this.fetchCurrentPlaylistTracks(token, nextTracksEndpoint);
    }
  }


  fetchCurrentPlaylistTracks = (token, endpoint) => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);

    fetch(endpoint, {
      method: 'GET',
      headers: myHeaders,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw Error(`Request rejected with status ${response.status}`);
      })
      .then((tracks) => {
        this.setState((prevState) => {
          const existingTracks = prevState.tracks.items || [];
          const fetchedTracks = tracks.items;
          return {
            error: false,
            errorMessage: '',
            tracks: {
              items: [...existingTracks, ...fetchedTracks],
            },
            nextTracksEndpoint: tracks.next,
          };
        });
      })
      .catch((error) => {
        this.setState({
          currentPlaylist: {
            error: true,
            errorMessage: error.message,
          },
        });
      });
  };

  render() {
    const {
      name, images, owner: { display_name: ownerName }, tracks: { total },
    } = this.props.playlist;
    const { items } = this.state.tracks;
    const imageSrc = images[0].url;
    return (
      <main className="current-playlist">
        <section className="current-playlist-header">
          <img className="current-playlist-image" src={imageSrc} alt="album artwork" />
          <div className="current-playlist-details">
            <h3 className="current-playlist-title"> {name} </h3>
            <h4>By {ownerName}</h4>
            <span>{total} tracks</span>
          </div>
        </section>

        <ul className="current-playlist-tracks">
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
