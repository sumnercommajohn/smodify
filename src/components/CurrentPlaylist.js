import React from 'react';
import macaroon from '../assets/img/Macaroonicon.png';
import { clonePlaylist, fetchSomeTracks } from '../helpers/spotifyHelpers';
import TrackItem from './TrackItem';
import { ErrorMessage } from './ErrorMessage';

class CurrentPlaylist extends React.Component {
  state = {
    errorMessage: '',
    tracks: {
      items: [],
      total: 0,
    },
    nextTracksEndpoint: null,
    selection: [],
  }

  componentDidMount() {
    const { token, playlist } = this.props;
    if (playlist.tracks.total) {
      this.getSomeTracks(token, playlist.tracks.href);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { token } = this.props;
    const { nextTracksEndpoint } = this.state;

    if (nextTracksEndpoint && nextTracksEndpoint !== prevState.nextTracksEndpoint) {
      this.getSomeTracks(token, nextTracksEndpoint);
    }
  }


  getSomeTracks = async (token, endpoint) => {
    try {
      const tracksObject = await fetchSomeTracks(token, endpoint);
      this.setState((prevState) => {
        const existingTracks = prevState.tracks.items || [];
        const fetchedTracks = tracksObject.items;
        fetchedTracks.forEach((item, i) => { item.key = i + Date.now(); });
        return {
          errorMessage: '',
          tracks: {
            ...tracksObject,
            items: [...existingTracks, ...fetchedTracks],
          },
          nextTracksEndpoint: tracksObject.next,
        };
      });
    } catch (error) {
      this.setState({
        currentPlaylist: {
          errorMessage: error.message,
        },
      });
    }
  }

  toggleSelection = (id, checked) => {
    const prevSelection = [...this.state.selection];
    if (prevSelection.length > 99) {
      this.setState({
        errorMessage: 'Unable to select more than 100 items.',
      });
      return;
    }

    const selection = checked
      ? [...prevSelection, id]
      : prevSelection.filter(item => item !== id);

    this.setState({ selection });
  }

  duplicateCurrentPlaylist = async () => {
    const {
      token, userId, playlist, setCurrentPlaylist, updateUserPlaylists, refreshPlaylists,
    } = this.props;
    const { tracks } = this.state;
    try {
      const newPlaylist = await clonePlaylist(token, userId, playlist, tracks);
      setCurrentPlaylist(newPlaylist);
      updateUserPlaylists(newPlaylist);
    } catch (error) {
      this.setState({
        errorMessage: error.message,
      });
    }
    refreshPlaylists();
  }

  render() {
    const {
      playlist: {
        name, images, owner: { display_name: ownerName }, tracks: { total },
      },
    } = this.props;
    const { errorMessage, tracks: { items } } = this.state;
    const imageSrc = images.length ? images[0].url : macaroon;
    return (
      <main className="current-playlist">
        <section className="current-playlist-header">
          <img className="current-playlist-image" src={imageSrc} alt="album artwork" />
          <div className="current-playlist-details">
            <h3 className="current-playlist-title"> {name} </h3>
            <h4>By {ownerName}</h4>
            <span>{total} tracks</span>
            <button type="button" className="copy-button" onClick={this.duplicateCurrentPlaylist}>
              Clone Playlist
            </button>
          </div>
        </section>
        {errorMessage && <ErrorMessage message={errorMessage} />}
        <ul className="current-playlist-tracks">
          {items
              && items.map(trackItem => (
                <TrackItem
                  key={trackItem.key}
                  uid={trackItem.key}
                  album={trackItem.track.album}
                  artists={trackItem.track.artists}
                  name={trackItem.track.name}
                  toggleSelection={this.toggleSelection}
                />
              ))}
        </ul>

      </main>
    );
  }
}

export default CurrentPlaylist;
