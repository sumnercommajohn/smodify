import React from 'react';
import macaroon from '../assets/img/Macaroonicon.png';
import { clonePlaylist, fetchSomeTracks, removeSelectedTracks } from '../helpers/spotifyAPIhelpers';
import { matchTracks } from '../helpers/otherHelpers';
import { PlaylistHeader } from './PlaylistHeader';
import { PlaylistDetails } from './PlaylistDetails';
import { PlaylistButtons } from './PlaylistButtons';
import { ErrorMessage } from './ErrorMessage';
import { FilterBar } from './FilterBar';
import EditPlaylistDetails from './EditPlaylistDetails';
import PlaylistTracks from './PlaylistTracks';
import TracksToolbar from './TracksToolbar';
import TrackList from './TrackList';


class CurrentPlaylist extends React.Component {
  state = {
    draftPlaylist: this.props.playlist,
    ownedByUser: (this.props.userId === this.props.playlist.owner.id),
    searchString: '',
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

    // continues loading tracks if playlist contains more than request limit (100 tracks)
    if (nextTracksEndpoint && nextTracksEndpoint !== prevState.nextTracksEndpoint) {
      this.getSomeTracks(token, nextTracksEndpoint);
    }

    // updates the number of tracks as displayed in UserPlaylists
    if (draftPlaylist.tracks.total !== prevState.draftPlaylist.tracks.total) {
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

  setSearchString = (e) => {
    console.log(e);
    const searchString = e.target.value;
    this.setState({ searchString });
  }

  clearSearchString = () => {
    console.log('clearing');
    const searchString = '';
    this.setState({ searchString });
  }

  toggleChecked = (uid, checkedState) => {
    this.setState((prevState) => {
      const items = [...prevState.tracks.items];
      const targetIndex = items.findIndex(item => item.uid === uid);
      items[targetIndex].isChecked = checkedState;
      return ({
        tracks: {
          ...prevState.tracks,
          items,
        },
      });
    });
  }

  toggleCheckedAll = (allTracksChecked = false) => {
    const { searchString, tracks: { items } } = this.state;
    const filteredItems = matchTracks(searchString, items);
    this.setState(prevState => ({
      ...prevState.tracks,
      items: filteredItems.map((item) => {
        item.isChecked = !allTracksChecked;
        return item;
      }),
    }));
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

  updateDraftPlaylist = (updatedFieldsObject) => {
    this.setState(prevState => ({
      draftPlaylist: {
        ...prevState.draftPlaylist,
        ...updatedFieldsObject,
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
      draftPlaylist, tracks: { items }, ownedByUser, searchString,
    } = this.state;
    const imageSrc = images.length ? images[0].url : macaroon;
    const filteredItems = matchTracks(searchString, items);
    const allTracksChecked = filteredItems.every(item => item.isChecked);
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
          <div className="track-tools">
            {ownedByUser
          && (
            <TracksToolbar
              clearSelection={this.clearSelection}
              toggleCheckedAll={this.toggleCheckedAll}
              deleteSelectedTracks={this.deleteSelectedTracks}
              setSearchString={this.setSearchString}
              numberOfChecked={numberOfChecked}
              allTracksChecked={allTracksChecked}
            />
          )
          }
            <FilterBar
              searchString={searchString}
              setSearchString={this.setSearchString}
              clearSearchString={this.clearSearchString}
            />
          </div>
          <TrackList
            ownedByUser={ownedByUser}
            filteredItems={filteredItems}
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
