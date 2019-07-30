import React from 'react';
import macaroon from '../assets/img/Macaroonicon.png';
import { clonePlaylist, fetchSomeTracks } from '../helpers/spotifyHelpers';
import TrackItem from './TrackItem';
import CurrentPlaylistHeader from './CurrentPlaylistHeader';
import { ErrorMessage } from './ErrorMessage';

class CurrentPlaylist extends React.Component {
  state = {
    errorMessage: '',
    draftPlaylist: this.props.playlist,
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
        errorMessage: error.message,
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
      token, userId, draftPlaylist, setCurrentPlaylist, updateUserPlaylists, refreshPlaylists,
    } = this.props;
    const { tracks } = this.state;
    try {
      const newPlaylist = await clonePlaylist(token, userId, draftPlaylist, tracks);
      updateUserPlaylists(newPlaylist);
      setCurrentPlaylist(newPlaylist);
    } catch (error) {
      this.setState({
        errorMessage: error.message,
      });
    }
    refreshPlaylists();
  }

  updateDraftPlaylist = (field, value) => {
    console.log(field, value);
    this.setState(prevState => ({
      draftPlaylist: {
        ...prevState.draftPlaylist,
        [field]: value,
      },
    }));
  }

  resetDraftPlaylist = () => {
    this.setState({
      draftPlaylist: this.props.playlist,
    });
  }

  render() {
    const {
      updateCurrentPlaylist,
      updateUserPlaylists,
    } = this.props;
    const { errorMessage, draftPlaylist, tracks: { items } } = this.state;

    return (
      <main className="current-playlist">

        <CurrentPlaylistHeader
          duplicateCurrentPlaylist={this.duplicateCurrentPlaylist}
          updateUserPlaylists={updateUserPlaylists}
          updateCurrentPlaylist={updateCurrentPlaylist}
          updateDraftPlaylist={this.updateDraftPlaylist}
          draftPlaylist={draftPlaylist}
        />
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
