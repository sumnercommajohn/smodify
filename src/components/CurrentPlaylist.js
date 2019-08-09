import React from 'react';
import macaroon from '../assets/img/Macaroonicon.png';
import { clonePlaylist, fetchSomeTracks } from '../helpers/spotifyHelpers';
import TrackItem from './TrackItem';
import { PlaylistHeader } from './PlaylistHeader';
import EditPlaylistDetails from './EditPlaylistDetails';
import { PlaylistDetails } from './PlaylistDetails';
import { PlaylistButtons } from './PlaylistButtons';
import { ErrorMessage } from './ErrorMessage';

class CurrentPlaylist extends React.Component {
  state = {
    warning: '',
    draftPlaylist: this.props.playlist,
    ownedByUser: (this.props.userId === this.props.playlist.owner.id),
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
    const { setError } = this.props;
    try {
      const tracksObject = await fetchSomeTracks(token, endpoint);
      this.setState((prevState) => {
        const existingTracks = prevState.tracks.items || [];
        const fetchedTracks = tracksObject.items;
        fetchedTracks.forEach((item, i) => { item.key = i + Date.now(); });
        return {
          tracks: {
            ...tracksObject,
            items: [...existingTracks, ...fetchedTracks],
          },
          nextTracksEndpoint: tracksObject.next,
        };
      });
      setError();
    } catch (error) {
      setError(error);
    }
  }

  toggleSelection = (id, checked) => {
    const prevSelection = [...this.state.selection];
    if (prevSelection.length > 99) {
      this.setState({
        warning: 'Unable to select more than 100 items.',
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
      token, userId, playlist,
      setCurrentPlaylist, setError, toggleEditPlaylist, updateUserPlaylists, refreshPlaylists,
    } = this.props;
    const { tracks } = this.state;
    try {
      const newPlaylist = await clonePlaylist(token, userId, playlist, tracks);
      updateUserPlaylists(newPlaylist);
      setCurrentPlaylist(newPlaylist);
      toggleEditPlaylist();
    } catch (error) {
      setError(error);
    }
    refreshPlaylists();
  }

  updateDraftPlaylist = (field, value) => {
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
      errorMessage,
      isEditing,
      playlist, playlist: { images },
      updateUserPlaylists,
      toggleEditPlaylist,
      token,
    } = this.props;
    const {
      draftPlaylist, tracks: { items }, ownedByUser,
    } = this.state;
    const imageSrc = images.length ? images[0].url : macaroon;

    return (
      <main className="current-playlist">

        <PlaylistHeader imageSrc={imageSrc}>
          {isEditing
            ? (
              <EditPlaylistDetails
                draftPlaylist={draftPlaylist}
                updateDraftPlaylist={this.updateDraftPlaylist}
                resetDraftPlaylist={this.resetDraftPlaylist}
                updateUserPlaylists={updateUserPlaylists}
                token={token}
                toggleEditPlaylist={toggleEditPlaylist}
              />
            )
            : <PlaylistDetails playlist={playlist} />
           }
          <PlaylistButtons
            duplicateCurrentPlaylist={this.duplicateCurrentPlaylist}
            isEditing={isEditing}
            ownedByUser={ownedByUser}
            toggleEditPlaylist={toggleEditPlaylist}
          />
        </PlaylistHeader>
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
