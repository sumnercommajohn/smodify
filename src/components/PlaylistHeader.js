import React from 'react';
import macaroon from '../assets/img/Macaroonicon.png';
import EditPlaylistDetails from './EditPlaylistDetails';
import { PlaylistDetails } from './PlaylistDetails';

class PlaylistHeader extends React.Component {
  render() {
    const {
      userId,
      imageSrc,
      playlist,
      draftPlaylist,
      edit,
      toggleEditPlaylist,
      updateCurrentPlaylist,
      duplicateCurrentPlaylist,
      updateDraftPlaylist,
      resetDraftPlaylist,
    } = this.props;

    return (
      <section className="current-playlist-header">
        <div className="playlist-header">
          <img className="current-playlist-image" src={imageSrc} alt="album artwork" />
          {edit
            ? (
              <EditPlaylistDetails
                draftPlaylist={draftPlaylist}
                updateDraftPlaylist={updateDraftPlaylist}
                updateCurrentPlaylist={updateCurrentPlaylist}
                toggleEditPlaylist={toggleEditPlaylist}
                resetDraftPlaylist={resetDraftPlaylist}
              />
            )
            : <PlaylistDetails playlist={playlist} />
           }
          <div className="current-playlist-buttons">
            <button type="button" className="action" onClick={duplicateCurrentPlaylist} disabled={edit}>
                Clone Playlist
            </button>
            { userId === playlist.owner.id
            && (
            <button type="button" className="action" onClick={toggleEditPlaylist} disabled={edit}>
                Edit Playlist
            </button>
            )
            }
          </div>

        </div>
      </section>

    );
  }
}

export default PlaylistHeader;
