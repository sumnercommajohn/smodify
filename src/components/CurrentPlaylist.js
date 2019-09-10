import React from 'react';
import macaroon from '../assets/img/Macaroonicon.png';
import { clonePlaylist, fetchSomeTracks, removeSelectedTracks } from '../helpers/spotifyHelpers';
import { PlaylistHeader } from './PlaylistHeader';
import EditPlaylistDetails from './EditPlaylistDetails';
import { PlaylistDetails } from './PlaylistDetails';
import { PlaylistButtons } from './PlaylistButtons';
import { ErrorMessage } from './ErrorMessage';
import PlaylistTracks from './PlaylistTracks';
import TracksToolbar from './TracksToolbar';
import TrackList from './TrackList';


class CurrentPlaylist extends React.Component {
  state = {
    draftPlaylist: this.props.playlist,
    ownedByUser: (this.props.userId === this.props.playlist.owner.id),
    tracks: {
      items: [],
    },
    nextTracksEndpoint: null,
  }

  componentDidMount() {
    const { token, playlist } = this.props;
    if (playlist.tracks.total) {
      this.getSomeTracks(token, playlist.tracks.href);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { token, updateUserPlaylists } = this.props;
    const { nextTracksEndpoint, draftPlaylist } = this.state;

    if (nextTracksEndpoint && nextTracksEndpoint !== prevState.nextTracksEndpoint) {
      this.getSomeTracks(token, nextTracksEndpoint);
    }
    if (draftPlaylist.tracks.total !== prevState.draftPlaylist.tracks.total) {
      console.log('updating draft playlist');
      updateUserPlaylists(draftPlaylist);
    }
  }


  getSomeTracks = async (token, endpoint) => {
    const { setError } = this.props;
    try {
      const tracksObject = await fetchSomeTracks(token, endpoint);
      this.setState((prevState) => {
        const existingTracks = prevState.tracks.items || [];
        const fetchedTracks = tracksObject.items;
        fetchedTracks.forEach((item, i) => {
          item.uid = i + Date.now();
          item.isChecked = false;
        });
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

  toggleChecked = (uid, checkedState) => {
    this.setState((prevState) => {
      const items = [...prevState.tracks.items];
      const targetIndex = items.findIndex(item => item.uid === uid);
      items[targetIndex].isChecked = checkedState;
      return ({
        tracks: {
          ...prevState.tracks,
          items: [...items],
        },
      });
    });
  }

  clearSelection = () => {
    this.setState(prevState => ({
      tracks: {
        ...prevState.tracks,
        items: (prevState.tracks.items.map((item) => {
          item.isChecked = false;
          return item;
        })),
      },
    }));
  }

  selectAll = () => {
    this.setState(prevState => ({
      tracks: {
        ...prevState.tracks,
        items: (prevState.tracks.items.map((item) => {
          item.isChecked = true;
          return item;
        })),
      },
    }));
  }

  // TODO: don't need updateDraftPlaylist, can just update in setState
  deleteSelectedTracks = async () => {
    const {
      token, playlist, setError,
    } = this.props;
    const { tracks: { items } } = this.state;
    const selection = items.filter(item => item.isChecked === true);
    try {
      const response = await removeSelectedTracks(token, playlist, selection);
      const remaining = items.filter(item => item.isChecked === false);
      this.setState(prevState => ({
        draftPlaylist: {
          ...prevState.draftPlaylist,
          snapshot_id: response.snapshot_id,
          tracks: {
            ...prevState.draftPlaylist.tracks,
            total: remaining.length,
          },
        },
        tracks: {
          items: [...remaining],
        },
      }));
      setError();
    } catch (error) {
      setError(error);
    }
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

  updateDraftPlaylist = (updatesObject) => {
    this.setState(prevState => ({
      draftPlaylist: {
        ...prevState.draftPlaylist,
        ...updatesObject,
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
      deletePlaylist,
      toggleEditPlaylist,
      token,
    } = this.props;
    const {
      draftPlaylist, tracks: { items }, ownedByUser,
    } = this.state;
    const imageSrc = images.length ? images[0].url : macaroon;
    const allTracksChecked = items.every(item => item.isChecked);
    const numberOfChecked = items.filter(item => item.isChecked).length;
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
            deletePlaylist={deletePlaylist}
            isEditing={isEditing}
            ownedByUser={ownedByUser}
            toggleEditPlaylist={toggleEditPlaylist}
          />
        </PlaylistHeader>
        {errorMessage && <ErrorMessage message={errorMessage} />}
        {items.length >= 1
        && (
        <PlaylistTracks>
          {ownedByUser
          && (
          <TracksToolbar
            clearSelection={this.clearSelection}
            selectAll={this.selectAll}
            allTracksChecked={allTracksChecked}
            numberOfChecked={numberOfChecked}
            deleteSelectedTracks={this.deleteSelectedTracks}
          />
          )
        }
          <TrackList
            ownedByUser={ownedByUser}
            items={items}
            toggleSelection={this.toggleSelection}
            toggleChecked={this.toggleChecked}
          />
        </PlaylistTracks>
        )
        }
      </main>
    );
  }
}

export default CurrentPlaylist;
