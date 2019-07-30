import React from 'react';
import macaroon from '../assets/img/Macaroonicon.png';
import EditCurrentPlaylistDetails from './EditCurrentPlaylistDetails';
import { CurrentPlaylistDetails } from './CurrentPlaylistDetails';

class CurrentPlaylistHeader extends React.Component {
  state={
    edit: false,
  }

  toggleEdit = () => {
    this.setState(prevState => ({
      edit: !prevState.edit,
    }));
  }


  render() {
    const {
      updateCurrentPlaylist,
      duplicateCurrentPlaylist,
      updateDraftPlaylist,
      draftPlaylist,
      draftPlaylist: { images },
    } = this.props;
    const { edit } = this.state;
    const imageSrc = images.length ? images[0].url : macaroon;
    return (
      <section className="current-playlist-header">
        <div className="playlist-header">
          <img className="current-playlist-image" src={imageSrc} alt="album artwork" />
          <div className="current-playlist-buttons">
            <button type="button" className="action" onClick={duplicateCurrentPlaylist} disabled={edit}>
                Clone Playlist
            </button>
            <button type="button" className="action" onClick={this.toggleEdit} disabled={edit}>
                Edit Playlist
            </button>
          </div>
          {edit
            ? (
              <EditCurrentPlaylistDetails
                toggleEdit={this.toggleEdit}
                draftPlaylist={draftPlaylist}
                updateDraftPlaylist={updateDraftPlaylist}
                {...this.props}
              />
            )
            : <CurrentPlaylistDetails {...this.props} />
           }

        </div>
      </section>

    );
  }
}

export default CurrentPlaylistHeader;
